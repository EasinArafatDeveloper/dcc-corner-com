import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import Category from '@/models/Category';
import { Package, Users, Tags, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectToDatabase();

  const [productCount, userCount, categoryCount] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Category.countDocuments(),
    // Order.countDocuments(), // Add when Orders model exists
  ]);

  const stats = [
    { name: 'Total Revenue', value: '৳0.00', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Total Orders', value: '0', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Products', value: productCount, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Total Users', value: userCount, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Categories', value: categoryCount, icon: Tags, color: 'text-teal-600', bg: 'bg-teal-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome to your store's control panel.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.name}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            {stat.name === 'Total Revenue' && (
              <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+0% from last month</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Recent Activity placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl bg-slate-50">
            <p className="text-muted-foreground">No recent orders found.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
             <a href="/dcc-hq/products/new" className="flex items-center justify-between p-4 rounded-xl border hover:bg-slate-50 transition-colors">
                <span className="font-medium">Add New Product</span>
                <Package className="w-5 h-5 text-muted-foreground" />
             </a>
             <a href="/dcc-hq/categories/new" className="flex items-center justify-between p-4 rounded-xl border hover:bg-slate-50 transition-colors">
                <span className="font-medium">Add Category</span>
                <Tags className="w-5 h-5 text-muted-foreground" />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
