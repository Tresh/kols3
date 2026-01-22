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
import { ScrollArea } from "@/components/ui/scroll-area";
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
          <ScrollArea className="h-[80vh] px-4 pb-6">
            <KOLOnboardingForm onComplete={handleComplete} />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">Create Your KOL Profile</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <KOLOnboardingForm onComplete={handleComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
