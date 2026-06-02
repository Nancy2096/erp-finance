import { DashboardLayout } from '@/components/dashboard-layout';
import { KPICard, KPIGrid } from '@/components/kpi-card';
import {
  ChartIngresosEgresos,
  ChartDividendos,
  ChartDistribucionActivos,
  ChartEvolucionValor,
} from '@/components/dashboard-charts';
import {
  TablaPagosPendientes,
  TablaActivosProximos,
  TablaAlertasCriticas,
  TablaUltimosMovimientos,
} from '@/components/dashboard-tables';
import { kpisDashboard } from '@/lib/mock-data';
import { formatCurrency, formatCurrencyCompact, formatPercentage, formatMonths } from '@/lib/format';
import {
  Building2,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  PiggyBank,
  BarChart3,
  Target,
  Clock,
  DollarSign,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen financiero y operativo de 1D10
          </p>
        </div>

        {/* Primary KPIs */}
        <KPIGrid>
          <KPICard
            title="Valor Total Activos"
            value={formatCurrencyCompact(kpisDashboard.valorTotalActivos)}
            subtitle="7 activos en portafolio"
            trend={{ value: 12.5, label: 'vs año anterior' }}
            icon={<Building2 className="h-5 w-5" />}
            variant="primary"
          />
          <KPICard
            title="Total Invertido"
            value={formatCurrencyCompact(kpisDashboard.totalInvertido)}
            subtitle={`${formatPercentage(kpisDashboard.porcentajeGlobalAdquisicion)} adquirido`}
            icon={<Wallet className="h-5 w-5" />}
          />
          <KPICard
            title="Pendiente por Pagar"
            value={formatCurrencyCompact(kpisDashboard.totalPendientePagar)}
            subtitle="En compromisos activos"
            icon={<Clock className="h-5 w-5" />}
            variant="warning"
          />
          <KPICard
            title="Rentas Mensuales"
            value={formatCurrency(kpisDashboard.rentasMensualesReales)}
            subtitle={`Esperado: ${formatCurrency(kpisDashboard.rentasMensualesEsperadas)}`}
            trend={{ value: -6.5, label: 'vs esperado' }}
            icon={<TrendingUp className="h-5 w-5" />}
            variant="success"
          />
          <KPICard
            title="Flujo Neto Mensual"
            value={formatCurrency(kpisDashboard.flujoNetoMensual)}
            subtitle="Ingresos menos egresos"
            trend={{ value: 8.2, label: 'vs mes anterior' }}
            icon={<Activity className="h-5 w-5" />}
          />
        </KPIGrid>

        {/* Secondary KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <KPICard
            title="Activos Generando"
            value={kpisDashboard.activosGenerandoRentas.toString()}
            subtitle="Activos productivos"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KPICard
            title="En Proceso"
            value={(kpisDashboard.activosEnCompra + kpisDashboard.activosEnPago).toString()}
            subtitle="Compra o pago"
            icon={<Clock className="h-4 w-4" />}
          />
          <KPICard
            title="ROI Promedio"
            value={formatPercentage(kpisDashboard.roiPromedio)}
            subtitle="Retorno de inversión"
            icon={<Target className="h-4 w-4" />}
          />
          <KPICard
            title="Payback Promedio"
            value={formatMonths(kpisDashboard.paybackPromedio)}
            subtitle="Tiempo de recuperación"
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <KPICard
            title="EBITDA Mensual"
            value={formatCurrency(kpisDashboard.ebitdaMensual)}
            subtitle="Utilidad operativa"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <KPICard
            title="Dividendos Pagados"
            value={formatCurrencyCompact(kpisDashboard.dividendosPagados)}
            subtitle={`Pendientes: ${formatCurrency(kpisDashboard.dividendosPorPagar)}`}
            icon={<PiggyBank className="h-4 w-4" />}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartIngresosEgresos />
          <ChartDividendos />
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartDistribucionActivos />
          <ChartEvolucionValor />
        </div>

        {/* Tables Grid */}
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <TablaPagosPendientes />
          <TablaActivosProximos />
          <TablaAlertasCriticas />
          <TablaUltimosMovimientos />
        </div>
      </div>
    </DashboardLayout>
  );
}
