
export interface EC2InstanceCost {
  instanceType: string;
  vcpu: number;
  memory: number;
  operatingSystem: string;
  ebsVolumeType: string;
  ebsVolumeSizeGB: number;
  instanceCostUSD: number;
  osCostUSD: number;
  ebsCostUSD: number;
  totalMonthlyCostUSD: number;
}
