import { useGetSalesStatsQuery } from "@/app/redux/features/dashboard/dashboardApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";

export default function DashboardStats() {
  const { data, isLoading, error } = useGetSalesStatsQuery(undefined);
  console.log(data)

  console.log(data)
  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load stats</p>;

  const stats = data?.data || {};

  const cards = [
    {
      title: "Total Sales",
      // value: `LKR ${stats.totalSales?.toLocaleString() || 0}`,
      value: 'LKR 0',

      icon: <DollarSign className="h-6 w-6 text-white" />,
      gradient: "bg-white/5 border-white/10 hover:bg-white/10",
      textColor: "text-white",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders || 0,
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      gradient: "bg-white/5 border-white/10 hover:bg-white/10",
      textColor: "text-white",
    },
    {
      title: "Paid Orders",
      value: stats.paidOrders || 0,
      icon: <Users className="h-6 w-6 text-white" />,
      gradient: "bg-white/5 border-white/10 hover:bg-white/10",
      textColor: "text-white",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders || 0,
      icon: <Package className="h-6 w-6 text-white" />,
      gradient: "bg-white/5 border-white/10 hover:bg-white/10",
      textColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`bg-white/5 border border-white/10 shadow-md rounded-2xl transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${card.gradient}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${card.textColor}`}>
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${card.textColor}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
