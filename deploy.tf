# ========================================
# Variables
# ========================================
variable "application_version" {
  type = string
}

variable "application_name" {
  type    = string
  default = "listing-api"
}

# ========================================
# Initialization
# ========================================
terraform {
  backend "s3" {
    encrypt        = "true"
    bucket         = "tango-terraform"
    key            = "resources/listing-api/tfstate.tf"
    region         = "eu-central-1"
    dynamodb_table = "terraform"
  }
}

provider "aws" {
  region = "eu-central-1"
}

provider "github" {
  token        = data.terraform_remote_state.account_resources.outputs.github_access_token
  base_url     = "https://github.com/tamer84"
}

data "terraform_remote_state" "account_resources" {
  backend = "s3"
  config = {
    encrypt = "true"
    bucket  = "tango-terraform"
    key     = "account_resources/tfstate.tf"
    region  = "eu-central-1"
  }
  workspace = "default"
}

data "terraform_remote_state" "environment_resources" {
  backend = "s3"
  config = {
    encrypt = "true"
    bucket  = "tango-terraform"
    key     = "environment_resources/tfstate.tf"
    region  = "eu-central-1"
  }
  workspace = terraform.workspace
}

data "terraform_remote_state" "terraform_build_image_resources" {
  backend = "s3"
  config = {
    encrypt = "true"
    bucket  = "tango-terraform"
    key     = "resources/terraform-build-image/tfstate.tf"
    region  = "eu-central-1"
  }
  workspace = terraform.workspace
}

data "aws_caller_identity" "current" {}

# ========================================
# Locals
# ========================================
locals {
  code         = "${var.application_name}.zip"
  cicd_branch  = contains(["dev", "test", "int"], terraform.workspace) ? "develop" : "main"
  region       = "eu-central-1"
  key_required = false
}

# ========================================
# Lambda
# ========================================
resource "aws_lambda_function" "listing-api" {
  function_name    = "${var.application_name}-${terraform.workspace}"
  handler          = "lib/index.handler"
  filename         = local.code
  runtime          = "nodejs14.x"
  memory_size      = 512
  publish          = true
  source_code_hash = filebase64sha256(local.code)
  role             = data.terraform_remote_state.account_resources.outputs.lambda_default_exec_role.arn
  timeout          = 30

  environment {
    variables = {
      version             = var.application_version
      EVENT_BUS           = data.terraform_remote_state.environment_resources.outputs.eventbus
      APPLICATION_NAME    = "${var.application_name}-${terraform.workspace}"
      LOG_LEVEL           = "INFO"
      IDENTITY_TABLE      = data.terraform_remote_state.environment_resources.outputs.identity_table.product.id
    }
  }

  dead_letter_config {
    target_arn = aws_sqs_queue.dlq.arn
  }

  vpc_config {
    security_group_ids = [data.terraform_remote_state.environment_resources.outputs.group_internal_access.id]
    subnet_ids         = data.terraform_remote_state.environment_resources.outputs.private-subnet.*.id
  }

  tags = {
    Terraform   = "true"
    Environment = terraform.workspace
  }
}

resource "aws_sqs_queue" "dlq" {
  name                        = "${var.application_name}-${terraform.workspace}"
  fifo_queue                  = false
  content_based_deduplication = false
  message_retention_seconds   = 1209600
}

resource "aws_lambda_permission" "listing_api_permission" {
  statement_id  = "AllowDealerApiToInvokeLambda${terraform.workspace}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.listing-api.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.listing-api.execution_arn}/*/*/*"
}

resource "aws_lambda_provisioned_concurrency_config" "provisioned_concurrency" {
  count                             = terraform.workspace == "prod" ? 1 : 0
  function_name                     = aws_lambda_function.listing-api.function_name
  provisioned_concurrent_executions = 5
  qualifier                         = aws_lambda_function.listing-api.version
}

# ========================================
# API Gateway
# ========================================
resource "aws_api_gateway_rest_api" "listing-api" {
  name = "${var.application_name}-${terraform.workspace}"

  endpoint_configuration {
    types            = ["REGIONAL"]
  }

  tags = {
    Terraform   = "true"
    Environment = terraform.workspace
  }
}



//===========  API Gateway Resources ==============//

// listings resource
resource "aws_api_gateway_resource" "listings" {
  rest_api_id = aws_api_gateway_rest_api.listing-api.id
  path_part   = "listings"
  parent_id   = aws_api_gateway_rest_api.listing-api.root_resource_id
}



//===========  API Gateway Methods ==============//
resource "aws_api_gateway_method" "put" {
  rest_api_id      = aws_api_gateway_rest_api.listing-api.id
  resource_id      = aws_api_gateway_resource.listings.id
  http_method      = "PUT"
  authorization    = "NONE"
  api_key_required = local.key_required
}

//======== AWS Proxy Integrations ===========//

resource "aws_api_gateway_integration" "put-integration" {
  rest_api_id             = aws_api_gateway_rest_api.listing-api.id
  resource_id             = aws_api_gateway_resource.listings.id
  http_method             = aws_api_gateway_method.put.http_method
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.listing-api.invoke_arn
  integration_http_method = "POST"
}


resource "aws_api_gateway_deployment" "deployment" {
  description = "Deployed by Terraform"

  depends_on = [
    aws_api_gateway_integration.put-integration
  ]

  rest_api_id = aws_api_gateway_rest_api.listing-api.id

  variables = {
    "app_version"    = var.application_version
    "lambda_version" = aws_lambda_function.listing-api.version
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudwatch_log_group" "listing-api-logs" {
  name = "/api/${aws_api_gateway_rest_api.listing-api.name}"

  tags = {
    Terraform   = "true"
    Environment = terraform.workspace
  }
}

resource "aws_api_gateway_stage" "listing-api-live-state" {
  stage_name    = "live"
  rest_api_id   = aws_api_gateway_rest_api.listing-api.id
  deployment_id = aws_api_gateway_deployment.deployment.id

  variables = {
    "app_version"    = var.application_version
    "lambda_version" = aws_lambda_function.listing-api.version
  }


}

resource "aws_api_gateway_base_path_mapping" "mapping" {
  api_id      = aws_api_gateway_rest_api.listing-api.id
  stage_name  = aws_api_gateway_stage.listing-api-live-state.stage_name
  base_path   = "listing"
  domain_name = terraform.workspace == "prod" ? data.terraform_remote_state.account_resources.outputs.api_gateway_domain.domain_name : data.terraform_remote_state.environment_resources.outputs.api_gateway_domain[0].domain_name
}

# ========================================
# CICD
# ========================================
module "cicd" {
  source = "git::ssh://git@github.com/tamer84/infra.git//modules/cicd?ref=develop"

  codestar_connection_arn = data.terraform_remote_state.account_resources.outputs.git_codestar_conn.arn

  pipeline_base_configs = {
    "name"        = "${var.application_name}-${terraform.workspace}"
    "bucket_name" = data.terraform_remote_state.environment_resources.outputs.cicd_bucket.id
    "role_arn"    = data.terraform_remote_state.account_resources.outputs.cicd_role.arn
  }

  codebuild_build_stage = {
    "project_name"        = "${var.application_name}-${terraform.workspace}"
    "github_branch"       = local.cicd_branch
    "github_repo"         = "tamer84/listing-api"
    "github_access_token" = data.terraform_remote_state.account_resources.outputs.github_access_token
    "github_certificate"  = "${data.terraform_remote_state.environment_resources.outputs.cicd_bucket.arn}/${data.terraform_remote_state.environment_resources.outputs.github_cert.id}"

    "service_role_arn"   = data.terraform_remote_state.account_resources.outputs.cicd_role.arn
    "cicd_bucket_id"     = data.terraform_remote_state.environment_resources.outputs.cicd_bucket.id
    "vpc_id"             = data.terraform_remote_state.environment_resources.outputs.vpc.id
    "subnets_ids"        = data.terraform_remote_state.environment_resources.outputs.private-subnet.*.id
    "security_group_ids" = [data.terraform_remote_state.environment_resources.outputs.group_internal_access.id]

    "docker_img_url"                   = data.terraform_remote_state.terraform_build_image_resources.outputs.ecr_repository.repository_url
    "docker_img_tag"                   = "latest"
    "docker_img_pull_credentials_type" = "SERVICE_ROLE"
    "buildspec"                        = "./buildspec.yml"
    "env_vars" = [
      {
        name  = "ENVIRONMENT"
        value = terraform.workspace
    }]
  }
}

# -------------- export / output variables
output "private_api_url" {
  value = aws_api_gateway_stage.listing-api-live-state.invoke_url
}

# -------------- Easier to find vpn accessible endpoint for the api
output "vpce_api_url" {
  value = data.terraform_remote_state.environment_resources.outputs.api_gateway_vpc_endpoint.dns_entry[0].dns_name
}

output "api_id" {
  value = aws_api_gateway_rest_api.listing-api.id
}
