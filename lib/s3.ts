import {
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { createS3Client, getBucketConfig } from "./aws-config";

const s3Client = createS3Client();

/**
 * Upload file to Cloudflare R2 with public access
 * @returns The S3 key of the uploaded file
 */
export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  isPublic: boolean = true
): Promise<string> {
  const { bucketName } = getBucketConfig();
  // Use simple 'uploads' folder - R2 supports public access via custom domain
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return key;
}

/**
 * Get permanent public URL for a file
 * R2 with custom domain provides permanent public URLs
 * @param key - The S3 key of the file
 * @returns Permanent public URL using custom domain
 */
export async function getFileUrl(key: string): Promise<string> {
  return getPublicUrl(key);
}

/**
 * Generate permanent public URL using custom domain
 * @param key - The S3 key of the file
 * @returns Public URL (e.g., https://catalog.ntec.network/uploads/filename.webp)
 */
export function getPublicUrl(key: string): string {
  const { publicDomain } = getBucketConfig();
  return `https://${publicDomain}/${key}`;
}

export async function deleteFile(key: string): Promise<void> {
  const { bucketName } = getBucketConfig();

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

export async function renameFile(oldKey: string, newKey: string): Promise<string> {
  const fullNewKey = `uploads/${Date.now()}-${newKey}`;

  const { bucketName } = getBucketConfig();
  const copyCommand = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${oldKey}`,
    Key: fullNewKey,
  });

  await s3Client.send(copyCommand);
  await deleteFile(oldKey);

  return fullNewKey;
}
