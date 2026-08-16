"use client";

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<{ url: string }>
  (() => import('swagger-ui-react'),
    {
      ssr: false,
    });

export default function ApiDoc() {
  return (
    <section className="container mx-auto p-4 min-h-screen">
      <div className="bg-white rounded-lg shadow p-4 mt-8">
        <SwaggerUI url="/api/swagger" />
      </div>
    </section>
  );
}
