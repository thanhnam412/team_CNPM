"use client";

import { useState, useEffect } from "react";
import { useGetMe } from "@/tanstack/useGetMe";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import {
  useMyExpertProfile,
  useUpsertMyExpertProfile,
} from "@/tanstack/useExperts";
import { SettingsBlock } from "@/block-ui/settings";

export default function ExpertSettingsPage() {
  const { data: me } = useGetMe();
  const queryClient = useQueryClient();
  const userId = me?.id;

  const [activeTab, setActiveTab] = useState("personal");
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    rate: "",
    bio: "",
    location: "",
  });

  // Fetch real profile data
  const { data: userProfile, isLoading: isUserLoading } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => userService.getUser(userId as string),
    enabled: !!userId,
  });

  const { data: expertProfile, isLoading: isExpertLoading } =
    useMyExpertProfile();

  // Sync fetched data to local state
  useEffect(() => {
    if (userProfile || expertProfile) {
      setFormData({
        name: userProfile?.name || me?.name || "",
        title: expertProfile?.title || "",
        rate: expertProfile?.hourlyRate?.toString() || "",
        bio: expertProfile?.bio || "",
        location: userProfile?.location || "",
      });
    }
  }, [userProfile, expertProfile, me]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      userService.updateUser(userId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const upsertExpertMutation = useUpsertMyExpertProfile();

  const handleSave = () => {
    updateMutation.mutate({ name: formData.name, location: formData.location });
    upsertExpertMutation.mutate({
      title: formData.title,
      hourlyRate: formData.rate,
      bio: formData.bio,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isSaving =
    updateMutation.isPending ||
    upsertExpertMutation.isPending ||
    isUserLoading ||
    isExpertLoading;

  return (
    <SettingsBlock
      me={me}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      formData={formData}
      onInputChange={handleInputChange}
      onSave={handleSave}
      isSaving={isSaving}
      showSuccess={showSuccess}
    />
  );
}
