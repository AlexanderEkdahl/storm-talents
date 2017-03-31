provider "aws" {
  region = "eu-central-1"
}

data "aws_iam_policy_document" "main" {
    statement {
        sid = "AddPerm"
        effect = "Allow"
        principals {
            type = "AWS"
            identifiers = ["*"]
        }
        actions = [
            "s3:GetObject"
        ]
        resources = [
            "arn:aws:s3:::storm-talents/*",
        ]
    }
}

resource "aws_s3_bucket" "primary" {
  bucket = "storm-talents"
  policy = "${data.aws_iam_policy_document.main.json}"

  website {
    index_document = "index.html"
  }
}
