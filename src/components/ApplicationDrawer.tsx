import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { KOLOnboardingForm } from "@/components/kol-form/KOLOnboardingForm";

interface ApplicationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApplicationDrawer = ({ open, onOpenChange }: ApplicationDrawerProps) => {
  const isMobile = useIsMobile();

  const handleComplete = () => {
    onOpenChange(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">Create Your KOL Profile</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto max-h-[80vh]">
            <KOLOnboardingForm onComplete={handleComplete} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Your KOL Profile</DialogTitle>
        </DialogHeader>
        <KOLOnboardingForm onComplete={handleComplete} />
      </DialogContent>
    </Dialog>
  );
};
