export type Role = "CLIENT" | "EXPERT" | "ADMIN";

export interface UserDto {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  currentRole: Role;
  location: string | null;
  online: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletDto {
  id: string;
  userId: string;
  balance: number | string;
  escrowBalance: number | string;
  totalEarned: number | string;
  totalSpent: number | string;
  updatedAt: string;
}

export interface MeProfileDto extends UserDto {
  wallet?: WalletDto | null;
}
