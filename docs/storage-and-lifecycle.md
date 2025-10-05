# ��������� ��������� � �������� ���������� �����

## 1. ����� ���������

- **��������**: Amazon S3 ��� ����������� ������� (Wasabi, Yandex Object Storage, Backblaze). ����������: ��������� S3 API, lifecycle-��������, ��������� ���������� (SSE-KMS), ���������������.
- **�����/��������**: MinIO � Kubernetes (StatefulSet + PV). ��������� ��������� � S3 SDK, ������������ IAM-�������� � lifecycle.

## 2. ��������� �������

- `media-temp-{env}` � ����������� �� ��������� (lifecycle 24 ����).
- `wa-sessions-{env}` � ���������� ����� WhatsApp (lifecycle 7 ����).
- `logs-archive-{env}` (�����������) � ����� �������������� ����� ����� ��������� �� �� (lifecycle 90 ����).

����������� ��������:

```
media-temp/{tenant_slug}/{conversation_id}/{message_id}/...
wa-sessions/{whatsapp_account_id}/session-{timestamp}.json
```

## 3. ��������

- **media-temp**: Expiration = 1 �����, ������� ������������� multipart-�������� ����� 24 ����.
- **wa-sessions**: Expiration = 7 ����, ������ ������� ������ ����� ����� ���������� ������.
- **logs-archive**: Expiration = 90 ����, ������������ ������� � �������� ��������� ����� 30 ����.

## 4. ������ � ������������

- ��������� IAM-������������ `media-proxy` � ������� `PutObject/GetObject/DeleteObject` ������������� �� ��������� �������.
- ������� �������� ��������� ����� ����� Vault/ExternalSecrets � ��������� pre-signed URLs.
- �������� ���������� pre-signed URLs � TTL < 15 ����� ��� ���������� �����.

## 5. ��������������

- Terraform-������ ��� �������� �������, IAM-������� ������� � lifecycle.
- Kubernetes `ExternalSecret` ��� S3 credentials.
- CronJob `media-cleaner` (��������� lifecycle) ���������� ������� ��������������� �������, �������� � ��.

## 6. �������������

- S3 Storage Lens ��� MinIO Prometheus exporter ��� ����������� ������ � ���������� ��������.
- ������ ��� ���������� ���� �������� � ������� ��������.
