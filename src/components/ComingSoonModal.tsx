import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Users } from "lucide-react";
import { ApplicationDrawer } from "@/components/ApplicationDrawer";

interface ComingSoonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ComingSoonModal = ({ open, onOpenChange }: ComingSoonModalProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleJoinNetwork = () => {
    onOpenChange(false);
    setDrawerOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center">
              <Rocket size={32} className="text-foreground" />
            </div>
            <DialogTitle className="text-2xl font-bold">Coming Soon</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Dashboard access is coming soon. Join the network to get early access.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button variant="hero" size="lg" onClick={handleJoinNetwork}>
              <Users size={18} />
              Join Network
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ApplicationDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
};
