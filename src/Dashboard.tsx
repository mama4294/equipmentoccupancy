import Header from "./Header";
import EquipmentOccupancyChart from "./EquipmentOccupancyChart";

function Dashboard() {
  return (
    <div className="h-screen w-screen ">
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <div className="w-full">
              <EquipmentOccupancyChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
