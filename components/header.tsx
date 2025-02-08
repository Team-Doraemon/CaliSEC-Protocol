import { Button } from "@/components/ui/button";
import { CircuitBoard } from "lucide-react";

interface HeaderProps {
  onAboutClick: () => void;
  onLogout: () => void;
}

export default function Header({ onAboutClick, onLogout }: HeaderProps) {
  return (
    <header className="border-b border-[#222] bg-[#0A0A0A]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CircuitBoard className="w-8 h-8 text-green-400" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg">CaliSEC Protocol</span>
            <span className="text-xs text-gray-400 hidden md:block">
              Calimero Secure Environment for Communication
            </span>
          </div>
        </div>
        <div>
          <Button
            variant="ghost"
            onClick={onAboutClick}
            className="text-gray-400 hover:text-white"
          >
            About
          </Button>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="text-gray-400 hover:text-red-600 "
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
