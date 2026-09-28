'use client';

import { AdminOverviewMetrics } from '../services/admin-analytics.service';
import { AdminMetricCard } from './AdminMetricCard';
import { DollarSign, ShoppingBag, Users, Percent, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface SimulatedMetricsProps {
  readonly metrics: AdminOverviewMetrics;
}

export function SimulatedMetrics({ metrics }: SimulatedMetricsProps) {
  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard
          title="Simulated Revenue"
          value={`$${metrics.simulatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={{ value: '+12.4% vs last month', isPositive: true }}
          description="Derived from non-cancelled mock orders"
          accentColor="success"
        />
        <AdminMetricCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={ShoppingBag}
          trend={{ value: '+8.2%', isPositive: true }}
          description="System orders across all users"
          accentColor="primary"
        />
        <AdminMetricCard
          title="Total Customers"
          value={metrics.totalCustomers}
          icon={Users}
          description="Registered mock accounts & guest buyers"
          accentColor="info"
        />
        <AdminMetricCard
          title="Simulated Conversion Rate"
          value={`${(metrics.simulatedConversionRate * 100).toFixed(1)}%`}
          icon={Percent}
          trend={{ value: '+0.6%', isPositive: true }}
          description="Orders ratio to simulated product views"
          accentColor="warning"
        />
      </div>

      {/* Tables Row: Top Products & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Products (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">Top Performing Products</h3>
              <p className="text-[11px] text-muted-foreground">Ranked by simulated order quantities and product views</p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Manage Products</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="pb-2">Product Title</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Units Sold</th>
                  <th className="pb-2 text-right">Simulated Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {metrics.topProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-semibold text-foreground truncate max-w-[200px]">
                      {p.title}
                    </td>
                    <td className="py-2.5 capitalize text-muted-foreground">{p.category}</td>
                    <td className="py-2.5 font-medium">${p.price.toFixed(2)}</td>
                    <td className="py-2.5 font-bold">{p.unitsSold}</td>
                    <td className="py-2.5 text-right font-bold text-foreground">
                      ${p.simulatedRevenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (1 Column) */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-foreground">Low Stock Inventory</h3>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {metrics.lowStockProducts.length} Items
            </span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {metrics.lowStockProducts.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                All inventory stock levels healthy.
              </p>
            ) : (
              metrics.lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-background"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-foreground truncate">{p.title}</p>
                    <span className="text-[11px] text-muted-foreground capitalize">{p.category}</span>
                  </div>
                  <span className="rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2 py-1 text-xs font-bold shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>

          <Link
            href="/admin/products"
            className="block text-center w-full rounded-xl bg-muted py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
          >
            Update Inventory Stock
          </Link>
        </div>
      </div>
    </div>
  );
}
