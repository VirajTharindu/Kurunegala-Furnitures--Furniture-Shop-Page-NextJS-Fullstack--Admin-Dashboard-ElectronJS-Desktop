export async function fetchGraphQL<T = Record<string, unknown>>(
    query: string,
    variables?: Record<string, unknown>
): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) throw new Error(`GraphQL network error: ${res.status}`);

    const { data, errors } = await res.json();
    if (errors?.length) throw new Error(errors[0].message);

    return data as T;
}
