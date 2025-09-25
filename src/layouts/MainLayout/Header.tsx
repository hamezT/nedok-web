import { BellIcon, SettingsIcon, LogOutIcon, Mail, User, ChevronDownIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Breadcrumb } from "../../components/ui/breadcrumb";
import { useDevice } from "../../contexts/DeviceContext";
import { useUser } from "../../hooks/useUserContext";
import { useState } from "react";

export const Header = (): JSX.Element => {
  const { selectedDevice, setSelectedDevice } = useDevice();
  const { user, logout } = useUser();
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Use window.location to force a full page reload
    window.location.href = '/login';
  };

  const handleAccountSettings = () => {
    // TODO: Implement account settings navigation
    console.log('Navigate to account settings');
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

        {/* Avatar Dropdown */}
        <div className="relative">
          <div
            className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#10b981] transition-all"
            onClick={() => setIsAvatarOpen(!isAvatarOpen)}
          >
            <img
              className="w-full h-full object-cover"
              alt="Avatar"
              src="/avatar.svg"
            />
            <ChevronDownIcon className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full border border-gray-300" />
          </div>

          {/* Dropdown Menu */}
          {isAvatarOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    alt="Avatar"
                    src="/avatar.svg"
                  />
                  <div>
                    <p className="font-medium text-sm">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user?.email || 'test@gmail.com'}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  handleAccountSettings();
                  setIsAvatarOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Account Settings</span>
                </div>
              </div>
              <div
                className="p-3 hover:bg-red-50 cursor-pointer text-red-600"
                onClick={() => {
                  handleLogout();
                  setIsAvatarOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <LogOutIcon className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          )}

          {/* Click outside to close */}
          {isAvatarOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsAvatarOpen(false)}
            />
          )}
        </div>
      </nav>
    </header>
  );
};
