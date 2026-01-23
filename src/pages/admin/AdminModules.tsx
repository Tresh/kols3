import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminModules, useCreateModule, useUpdateModule } from '@/hooks/useAdminScholarship';
import type { UnlockType } from '@/types/scholarship';
import { Plus, Pencil, Loader2, BookOpen, Lock, Calendar, CheckSquare, Shield } from 'lucide-react';

const unlockTypes: { value: UnlockType; label: string; icon: React.ElementType }[] = [
  { value: 'day_count', label: 'Day Count', icon: Calendar },
  { value: 'task_completion', label: 'Task Completion', icon: CheckSquare },
  { value: 'admin_unlock', label: 'Admin Unlock', icon: Shield },
];

interface ModuleFormData {
  title: string;
  description: string;
  order_index: number;
  unlock_type: UnlockType;
  unlock_day: number | null;
  content_url: string;
  is_active: boolean;
}

const defaultFormData: ModuleFormData = {
  title: '',
  description: '',
  order_index: 0,
  unlock_type: 'day_count',
  unlock_day: 1,
  content_url: '',
  is_active: true,
};

export default function AdminModules() {
  const { data: modules = [], isLoading } = useAdminModules();
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ModuleFormData>(defaultFormData);

  const handleOpenCreate = () => {
    setEditingModuleId(null);
    setFormData({
      ...defaultFormData,
      order_index: modules.length,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (module: any) => {
    setEditingModuleId(module.id);
    setFormData({
      title: module.title,
      description: module.description || '',
      order_index: module.order_index,
      unlock_type: module.unlock_type,
      unlock_day: module.unlock_day,
      content_url: module.content_url || '',
      is_active: module.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const moduleData = {
      title: formData.title,
      description: formData.description || null,
      order_index: formData.order_index,
      unlock_type: formData.unlock_type,
      unlock_day: formData.unlock_type === 'day_count' ? formData.unlock_day : null,
      unlock_task_id: null,
      content_url: formData.content_url || null,
      is_active: formData.is_active,
    };

    if (editingModuleId) {
      updateModule.mutate({ moduleId: editingModuleId, updates: moduleData });
    } else {
      createModule.mutate(moduleData);
    }
    setDialogOpen(false);
  };

  const handleToggleActive = (moduleId: string, currentValue: boolean) => {
    updateModule.mutate({ moduleId, updates: { is_active: !currentValue } });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Course Modules</h1>
            <p className="text-muted-foreground">Manage scholarship course modules</p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Module
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Modules</p>
              <p className="text-2xl font-bold">{modules.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {modules.filter(m => m.is_active).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modules Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Unlock Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No modules created yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    modules.map((module) => {
                      const unlockType = unlockTypes.find(t => t.value === module.unlock_type);
                      const UnlockIcon = unlockType?.icon || Lock;
                      
                      return (
                        <TableRow key={module.id}>
                          <TableCell className="font-medium">
                            {module.order_index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{module.title}</p>
                                {module.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {module.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UnlockIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                {unlockType?.label}
                                {module.unlock_type === 'day_count' && module.unlock_day && (
                                  <span className="text-muted-foreground ml-1">
                                    (Day {module.unlock_day})
                                  </span>
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {module.content_url ? (
                              <a 
                                href={module.content_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm"
                              >
                                View Content
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-sm">No content</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(module.id, module.is_active)}
                            >
                              {module.is_active ? (
                                <Badge variant="secondary" className="bg-green-500/20 text-green-600">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-muted text-muted-foreground">Inactive</Badge>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(module)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingModuleId ? 'Edit Module' : 'Create Module'}</DialogTitle>
            <DialogDescription>
              {editingModuleId ? 'Update the module details below.' : 'Fill in the module details below.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter module title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter module description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label>Unlock Type</Label>
                <Select
                  value={formData.unlock_type}
                  onValueChange={(value: UnlockType) => setFormData({ ...formData, unlock_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unlockTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.unlock_type === 'day_count' && (
              <div className="space-y-2">
                <Label htmlFor="unlock_day">Unlock Day</Label>
                <Input
                  id="unlock_day"
                  type="number"
                  min={1}
                  max={30}
                  value={formData.unlock_day || 1}
                  onChange={(e) => setFormData({ ...formData, unlock_day: parseInt(e.target.value) || 1 })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content_url">Content URL</Label>
              <Input
                id="content_url"
                value={formData.content_url}
                onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.title || createModule.isPending || updateModule.isPending}
            >
              {(createModule.isPending || updateModule.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {editingModuleId ? 'Update Module' : 'Create Module'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
