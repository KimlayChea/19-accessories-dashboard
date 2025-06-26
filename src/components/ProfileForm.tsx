import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthUser } from "@/customs/authentication/useAuthUser";
import { useUpdateAvatar } from "@/customs/authentication/useUpdateAvatar";
import { useUpdateUser } from "@/customs/authentication/useUpdateUser";
import { useVerifyCurrentPassword } from "@/customs/authentication/useVerifyCurrentPassword";

export const ProfileForm = () => {
  const { user } = useAuthUser();
  const { updateAvatar, isPending: isPendingUpdateAvatar } = useUpdateAvatar();
  const { updateUser, isPending: isPendingUpdateUser } = useUpdateUser();
  const { verifyCurrentPassword, isPending: inPendingVerifyCurrentPassword } =
    useVerifyCurrentPassword();

  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.fullName,
    email: user?.user_metadata?.email,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: "Please select a valid image file (JPEG, PNG, GIF, WEBP)",
      });
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: "Image is too large. Maximum size is 2MB",
      });
      return;
    }

    updateAvatar(file, {
      onSuccess: () => {
        toast({
          title: "Update successful",
          description: "User profile successfully updated",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Update failed",
          description:
            error.message || "Something went wrong, please try again.",
        });
      },
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.fullName || !profileData.email) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Please fill in all fields!",
      });
      setProfileData({
        fullName: user?.user_metadata?.fullName,
        email: user?.user_metadata?.email,
      });
      return;
    }
    if (profileData.fullName && profileData.fullName.length < 3) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Name must be at least 3 characters long!",
      });
      return;
    }

    updateUser(
      {
        fullName: profileData.fullName,
      },
      {
        onSuccess: () => {
          toast({
            title: "Profile Updated",
            description:
              "Your profile information has been updated successfully.",
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description:
              error.message || "Something went wrong, please try again.",
          });
        },
      }
    );
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Password must be at least 8 characters long!",
      });
      return;
    }

    if (!passwordData.currentPassword) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Please enter your current password!",
      });

      return;
    }

    verifyCurrentPassword(
      {
        email: user?.user_metadata?.email,
        currentPassword: passwordData.currentPassword,
      },
      {
        onSuccess: () => {
          updateUser({ password: passwordData.newPassword });

          toast({
            title: "Password Updated",
            description: "Your password has been changed successfully.",
          });
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "Please check your credentials and try again.",
          });
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                {user.user_metadata.avatar ? (
                  <AvatarImage
                    src={user?.user_metadata?.avatar}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-lg">
                    {profileData.fullName[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col items-center space-y-2">
                <Label htmlFor="profileImage" className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </div>
                </Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isPendingUpdateAvatar}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                disabled={true}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPendingUpdateUser}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPendingUpdateUser || inPendingVerifyCurrentPassword}
            >
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
