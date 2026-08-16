import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// helper functions inside the API route to convert between the DB format and the Frontend format.

// Convert DB format to Frontend format (for GET responses)
export const mapToFrontendProduct = (dbProduct: any) => {
  return {
    ...dbProduct,
    price: Number(dbProduct.price),

    // Fallback to stringified empty structures to avoid JSON.parse errors
    tags: JSON.parse(dbProduct.tags || "[]"),
    specs: JSON.parse(dbProduct.specs || "{}")

  }
}


// Convert Frontend format to DB format (for POST/PUT requests)
export const mapToDatabaseProduct = (frontendProduct: any) => {
  return {
    ...frontendProduct,

    // Price can remain a number, Prisma converts it to Decimal automatically
    tags: JSON.stringify(frontendProduct.tags),
    specs: JSON.stringify(frontendProduct.specs)
  };
};




// --- User Mappers ---
export const mapToFrontendUser = (dbUser: any) => {
  if (!dbUser) return null;
  // Omit passwordHash before sending to frontend
  const { passwordHash, ...safeUser } = dbUser;
  return safeUser;
};

export const mapToDatabaseUser = (frontendUser: any) => {
  return { ...frontendUser };
};


// --- Cart Item Mappers ---
export const mapToFrontendCartItem = (dbCartItem: any) => {
  if (!dbCartItem) return null;
  return {
    ...dbCartItem,
    // if product is joined, map it too
    product: dbCartItem.product ? mapToFrontendProduct(dbCartItem.product) : undefined
  };
};


// --- Cart Mappers ---
export const mapToFrontendCart = (dbCart: any) => {
  if (!dbCart) return null;
  return {
    ...dbCart,
    items: dbCart.items ? dbCart.items.map(mapToFrontendCartItem) : []
  };
};

export const mapToDatabaseCart = (frontendCart: any) => {
  return { ...frontendCart };
};


// --- Order Item Mappers ---
export const mapToFrontendOrderItem = (dbOrderItem: any) => {
  if (!dbOrderItem) return null;
  return {
    ...dbOrderItem,
    unitPrice: Number(dbOrderItem.unitPrice),
    product: dbOrderItem.product ? mapToFrontendProduct(dbOrderItem.product) : undefined
  };
};

// --- Order Mappers ---
export const mapToFrontendOrder = (dbOrder: any) => {
  if (!dbOrder) return null;
  return {
    ...dbOrder,
    totalAmount: Number(dbOrder.totalAmount),
    items: dbOrder.items ? dbOrder.items.map(mapToFrontendOrderItem) : [],
    user: dbOrder.user ? mapToFrontendUser(dbOrder.user) : undefined
  };
};

export const mapToDatabaseOrder = (frontendOrder: any) => {
  return { ...frontendOrder };
};

//..................................................
//Error Handler for server responses
export const handleError = (error: unknown) => {
  console.log("Internal server error", error);

  return NextResponse.json({
    message: "Internal server error"
  }, {
    status: 500,
    headers: {
      "Content-Type": "application/json"
    }
  });

}

