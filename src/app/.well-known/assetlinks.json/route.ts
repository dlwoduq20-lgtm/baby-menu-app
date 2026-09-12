import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const assetlinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.jy.babymenu',
        sha256_cert_fingerprints: [
          '21:42:3A:81:C3:C9:CE:34:75:DC:A1:1C:3E:D5:4C:05:40:BF:E0:BA:49:A4:60:39:35:09:C0:7B:2F:14:9C:B6'
        ]
      }
    }
  ];

  return NextResponse.json(assetlinks, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
