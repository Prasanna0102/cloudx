// Enums for Status Fields
export enum BuildTaskStatus {
    QUEUED = "QUEUED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    TIMED_OUT = "TIMED_OUT",
    RETRYING = "RETRYING",
  }
  
  export enum DeploymentStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    ROLLED_BACK = "ROLLED_BACK",
    DEACTIVATED = "DEACTIVATED",
  }
  
  export enum ProjectStatus {
    CREATED = "CREATED",
    BUILDING = "BUILDING",
    DEPLOYED = "DEPLOYED",
    FAILED = "FAILED",
    SAVED = "SAVED",
    ARCHIVED = "ARCHIVED",
  }
  
  export enum TeamRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
  }
  
  // Types for Models
  export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    projects: Project[];
    teamMembers: TeamMember[];
  }
  
  export interface Team {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    members: TeamMember[];
    projects: Project[];
    analytics?: TeamAnalytics | null;
  }
  
  export interface TeamMember {
    id: string;
    teamId: string;
    userId: string;
    role: TeamRole;
    team: Team;
    user: User;
  }
  
  export interface Project {
    id: string;
    name: string;
    userId: string;
    teamId?: string | null;
    gitUrl: string;
    status: ProjectStatus;
    buildLogs: BuildLog[];
    user: User;
    team?: Team | null;
    BuildTask: BuildTask[];
    Deployment: Deployment[];
    lastBuildAt?: Date | null;
    saveCount: number;
  }
  
  export interface BuildLog {
    id: number;
    projectId: string;
    buildStep: string;
    timestamp: Date;
    output: string;
    isError: boolean;
    project: Project;
  }
  
  export interface BuildTask {
    id: number;
    projectId: string;
    status: BuildTaskStatus;
    startedAt: Date;
    finishedAt?: Date | null;
    triggeredBy?: string | null;
    buildType?: string | null;
    version?: number | null;
    project: Project;
  }
  
  export interface Deployment {
    id: string;
    name: string;
    projectId: string;
    subDomain: string;
    Domain?: string | null;
    version?: number | null;
    status: DeploymentStatus;
    visits: number;
    errorRate?: number | null;
    createdAt: Date;
    project: Project;
  }
  
  export interface TeamAnalytics {
    id: string;
    teamId: string;
    buildSuccessRate: number;
    avgBuildTime: number;
    deployments: number;
    projectCount: number;
    team: Team;
  }
  
  // Types for Relationships
  export type TeamWithMembers = Team & {
    members: TeamMember[];
  };
  
  export type ProjectWithDetails = Project & {
    buildLogs: BuildLog[];
    BuildTask: BuildTask[];
    Deployment: Deployment[];
  };
  
  export type UserWithTeams = User & {
    teamMembers: TeamMember[];
    projects: Project[];
  };
  
  export type TeamAnalyticsWithDetails = TeamAnalytics & {
    team: Team;
  };
  