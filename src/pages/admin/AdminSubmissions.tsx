import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminSubmissions, useReviewSubmission } from '@/hooks/useAdminScholarship';
import { CheckCircle, XCircle, Clock, Search, Loader2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminSubmissions() {
  const { data: submissions = [], isLoading } = useAdminSubmissions();
  const reviewSubmission = useReviewSubmission();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredSubmissions = submissions.filter(sub => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      sub.profile?.display_name?.toLowerCase().includes(searchLower) ||
      sub.profile?.email?.toLowerCase().includes(searchLower) ||
      sub.task?.title?.toLowerCase().includes(searchLower);
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && sub.status === activeTab;
  });

  const openReviewDialog = (submission: any, action: 'approved' | 'rejected') => {
    setSelectedSubmission(submission);
    setReviewAction(action);
    setRejectionReason('');
    setReviewDialogOpen(true);
  };

  const handleReview = () => {
    if (selectedSubmission) {
      reviewSubmission.mutate({
        submissionId: selectedSubmission.id,
        status: reviewAction,
        xpEarned: reviewAction === 'approved' ? selectedSubmission.task?.xp_reward : undefined,
        rejectionReason: reviewAction === 'rejected' ? rejectionReason : undefined,
      });
      setReviewDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Task Submissions</h1>
          <p className="text-muted-foreground">Review user task submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Search */}
        <div className="flex items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
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
                    <TableHead>User</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No submissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={sub.profile?.avatar_url || undefined} />
                              <AvatarFallback>
                                {sub.profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{sub.profile?.display_name || 'Anonymous'}</p>
                              <p className="text-xs text-muted-foreground">{sub.profile?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sub.task?.title || 'Unknown Task'}</p>
                            <Badge className="bg-primary/20 text-primary text-xs mt-1">
                              +{sub.task?.xp_reward || 0} XP
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {sub.proof_link ? (
                            <a 
                              href={sub.proof_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 text-sm"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </a>
                          ) : sub.proof_text ? (
                            <span className="text-sm text-muted-foreground line-clamp-1">
                              {sub.proof_text}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(sub.submitted_at), 'PP p')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(sub.status)}
                          {sub.xp_earned > 0 && sub.status === 'approved' && (
                            <p className="text-xs text-green-600 mt-1">+{sub.xp_earned} XP</p>
                          )}
                          {sub.rejection_reason && (
                            <p className="text-xs text-red-500 mt-1">{sub.rejection_reason}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {sub.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => openReviewDialog(sub, 'approved')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => openReviewDialog(sub, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approved' ? 'Approve Submission' : 'Reject Submission'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approved'
                ? `This will award ${selectedSubmission?.task?.xp_reward || 0} XP to the user.`
                : 'Provide a reason for rejecting this submission.'}
            </DialogDescription>
          </DialogHeader>

          {reviewAction === 'approved' && selectedSubmission && (
            <div className="py-4">
              <p className="text-sm"><strong>Task:</strong> {selectedSubmission.task?.title}</p>
              <p className="text-sm"><strong>User:</strong> {selectedSubmission.profile?.display_name}</p>
              <p className="text-sm"><strong>XP Award:</strong> +{selectedSubmission.task?.xp_reward} XP</p>
              {selectedSubmission.proof_link && (
                <a 
                  href={selectedSubmission.proof_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Submission Proof
                </a>
              )}
            </div>
          )}

          {reviewAction === 'rejected' && (
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={reviewAction === 'approved' ? 'default' : 'destructive'}
              onClick={handleReview}
              disabled={reviewSubmission.isPending}
            >
              {reviewSubmission.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {reviewAction === 'approved' ? 'Approve & Award XP' : 'Reject Submission'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
