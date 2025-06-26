import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UserPlus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useSignup } from "../customs/authentication/useSignup";

export const UserManagement = () => {
  const { signup, isPending } = useSignup();

  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newUser.fullName ||
      !newUser.email ||
      !newUser.password ||
      !newUser.confirmPassword
    )
      return;
    if (newUser.password !== newUser.confirmPassword) return;

    signup(
      {
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
      },
      {
        onSuccess: (user) => {
          console.log(user);
          toast({
            title: "User Created",
            description: `User ${newUser.fullName} has been created successfully.`,
          });
          setNewUser({
            email: "",
            fullName: "",
            password: "",
            confirmPassword: "",
          });
          setIsDialogOpen(false);
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "User Creation Failed",
            description:
              error?.message || "An error occurred while creating the user.",
            variant: "destructive", // if your toast supports variants
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Admin</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Create admin
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-md"
              aria-description="dialog-desc"
            >
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
                <p id="dialog-desc" className="text-sm text-muted-foreground">
                  Fill in the details below to create a new admin user.
                </p>
              </DialogHeader>

              <form
                onSubmit={handleCreateUser}
                className="space-y-4"
                aria-describedby="dialog-desc"
              >
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={newUser.fullName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isPending ? "Loading ..." : " Create User"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
    </div>
  );
};
