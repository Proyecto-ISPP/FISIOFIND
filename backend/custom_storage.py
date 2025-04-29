import boto3
from django.core.files.storage import Storage
from django.conf import settings
from botocore.exceptions import NoCredentialsError


class DigitalOceanMediaStorage(Storage):
    """Custom Storage for DigitalOcean Spaces"""

    def __init__(self):
        self.client = boto3.client(
            "s3",
            region_name=settings.DIGITALOCEAN_REGION,
            endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL,
            aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
            aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
        )

    def _open(self, name, mode="rb"):
        return self.client.get_object(Bucket=settings.DIGITALOCEAN_SPACE_NAME, Key=name)["Body"]

    def _save(self, name, content):
        try:
            self.client.upload_fileobj(
                content,
                settings.DIGITALOCEAN_SPACE_NAME,
                name,
                ExtraArgs={"ACL": "public-read"},
            )
        except NoCredentialsError:
            raise ValueError("Credenciales inválidas para DigitalOcean Spaces.")
        return name

    def exists(self, name):
        """Check if file exists in DigitalOcean Spaces"""
        try:
            self.client.head_object(Bucket=settings.DIGITALOCEAN_SPACE_NAME, Key=name)
            return True
        except:
            return False

    def url(self, name):
        return f"{settings.DIGITALOCEAN_ENDPOINT_URL}/{name}"
