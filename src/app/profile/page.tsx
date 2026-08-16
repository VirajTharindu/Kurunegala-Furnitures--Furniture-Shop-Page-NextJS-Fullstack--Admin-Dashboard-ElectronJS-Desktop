import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/dao/userDao";
import { getOrdersByUserId } from "@/lib/dao/orderDao";
import { Package, User, Clock, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: 'My Profile - Kurunegala Furnitures',
};

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const [user, orders] = await Promise.all([
        getUserById(session.user.id),
        getOrdersByUserId(session.user.id),
    ]);

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-accent/10 p-8 rounded-3xl border border-border">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-foreground text-background flex items-center justify-center rounded-full text-3xl font-serif">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif italic tracking-tight">{user.name || "User"}</h1>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <User size={14} />
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 text-center md:text-right">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold tracking-widest uppercase">
                            {user.role}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Account Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-background/50 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <User className="text-primary" />
                                Account Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Name</p>
                                    <p className="font-medium">{user.name || "Not provided"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Member Since</p>
                                    <p className="font-medium">
                                        {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString() : "Unknown"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-serif italic flex items-center gap-2">
                            <Package className="text-primary" />
                            Order History
                        </h2>
                        
                        {orders.length === 0 ? (
                            <div className="bg-background/50 border border-border border-dashed rounded-2xl p-12 text-center">
                                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-bold mb-2">No orders yet</h3>
                                <p className="text-muted-foreground mb-6">Looks like you haven't made any purchases.</p>
                                <Link 
                                    href="/"
                                    className="px-6 py-3 bg-foreground text-background font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity text-sm inline-block"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order: any) => (
                                    <div key={order.id} className="bg-background/50 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-sm hover:border-foreground/20 transition-colors">
                                        {/* Order Header */}
                                        <div className="bg-accent/5 p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex gap-6">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Order Placed</p>
                                                    <p className="text-sm font-medium flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Total</p>
                                                    <p className="text-sm font-medium flex items-center gap-1">
                                                        <CreditCard size={12} />
                                                        ${Number(order.totalAmount).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${
                                                    order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Order Items */}
                                        <div className="p-4">
                                            <div className="space-y-4">
                                                {order.items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-accent/20 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                            {item.product?.modelUrl ? (
                                                                <Image 
                                                                    src={item.product.modelUrl} 
                                                                    alt={item.product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="w-6 h-6 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                            )}
                                                        </div>
                                                        <div className="flex-grow">
                                                            <Link href={`/product/${item.product?.id}`} className="font-bold hover:underline">
                                                                {item.product?.name || "Unknown Product"}
                                                            </Link>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Qty: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
