import { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";

interface ApplicationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApplicationDrawer = ({ open, onOpenChange }: ApplicationDrawerProps) => {
  const isMobile = useIsMobile();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (open) {
      setIframeLoaded(false);
    }
  }, [open]);

  const formContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden rounded-lg border border-border/30 bg-card">
        {!iframeLoaded && (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            Loading form...
          </div>
        )}
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdNpA0S_lJkN98zTndJYoLre3620TrPlJtv_YTG9GZkNT6RYw/viewform?embedded=true"
          className={`w-full h-[500px] md:h-[600px] ${iframeLoaded ? 'block' : 'hidden'}`}
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          onLoad={() => setIframeLoaded(true)}
          title="KOLS3 Application Form"
        />
      </div>
      <div className="pt-4 text-center text-xs text-muted-foreground">
        By submitting, you agree to our{" "}
        <Link to="/terms" className="underline hover:text-foreground" onClick={() => onOpenChange(false)}>
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="underline hover:text-foreground" onClick={() => onOpenChange(false)}>
          Privacy Policy
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">Join the KOLS3 Network</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            {formContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join the KOLS3 Network</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};
