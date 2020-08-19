export interface AvatarInfo {
  id: number;
  name: string;
  fileName: string;
}

export interface AvatarAddRequest {
  name: string;
  imageBase64: string;
}
