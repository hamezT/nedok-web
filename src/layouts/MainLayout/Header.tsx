import { BellIcon, SettingsIcon, LogOutIcon, UserIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Breadcrumb } from "../../components/ui/breadcrumb";
import { useDevice } from "../../contexts/DeviceContext";
import { useUser } from "../../hooks/useUserContext";

export const Header = (): JSX.Element => {
  const { selectedDevice, setSelectedDevice } = useDevice();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    // Use window.location to force a full page reload
    window.location.href = '/login';
  };

  const breadcrumbItems = [
    {
      label: "Home",
      onClick: () => setSelectedDevice(null),
    },
    ...(selectedDevice
      ? [
          {
            label: "Gateway List",
          },
        ]
      : []),
  ];
  return (
    <header className="flex h-16 items-center gap-4 pl-0 pr-5 py-3 relative w-full bg-white border-b border-solid border-[#ebebeb]">
      <img
        className="relative flex-[0_0_auto] h-16 mt-[-12.00px] mb-[-12.00px]"
        alt="Sidebar header"
        src="/sidebar-header.svg"
      />

      <div className="flex items-center gap-1 relative flex-1 grow">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <nav className="inline-flex gap-4 flex-[0_0_auto] items-center relative">
        <Button
          variant="outline"
          size="icon"
          className="inline-flex gap-1 p-1.5 flex-[0_0_auto] bg-white border border-solid border-[#ebebeb] shadow-regular-shadow-x-small items-center justify-center rounded-lg h-auto"
        >
          <BellIcon className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="flex w-8 h-8 gap-[4.57px] p-[4.57px] bg-white border-[1.14px] border-solid border-[#ebebeb] shadow-[0px_1.14px_2.29px_#0a0d1408] items-center justify-center rounded-lg h-auto"
        >
          <SettingsIcon className="w-[18.29px] h-[18.29px]" />
        </Button>

        {/* User Info and Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{user?.name || user?.email || 'User'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex gap-2 items-center bg-white border border-solid border-[#ebebeb] shadow-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <LogOutIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        <img className="relative w-10 h-10" alt="Avatar" src="/avatar.svg" />
      </nav>
    </header>
  );
};
