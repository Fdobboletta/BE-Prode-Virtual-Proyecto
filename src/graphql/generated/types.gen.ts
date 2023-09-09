/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../context"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ForecastInput: { // input type
    matchId: string; // ID!
    score?: NexusGenEnums['Score'] | null; // Score
  }
  ScoreUpdateInput: { // input type
    matchId: string; // ID!
    score?: NexusGenEnums['Score'] | null; // Score
  }
}

export interface NexusGenEnums {
  Score: "away" | "draw" | "home"
  UserRole: "admin" | "player"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Match: { // root type
    awayTeam: string; // String!
    homeTeam: string; // String!
    id: string; // ID!
    officialScore?: NexusGenEnums['Score'] | null; // Score
    roomId: string; // ID!
    startDate: string; // String!
  }
  MercadoPagoAccessToken: { // root type
    accessToken: string; // String!
  }
  MercadoPagoPreference: { // root type
    preferenceId: string; // ID!
    redirectLink: string; // String!
  }
  Mutation: {};
  Participant: { // root type
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    score?: number | null; // Int
  }
  Query: {};
  Room: { // root type
    creatorId: string; // ID!
    dueDate: string; // String!
    entryPrice: number; // Float!
    id: string; // ID!
    isActive: boolean; // Boolean!
    isClosed: boolean; // Boolean!
    name: string; // String!
    paymentLink: string; // String!
    prizeMoney: number; // Float!
  }
  RoomParticipantWithScore: { // root type
    email: string; // String!
    lastName: string; // String!
    name: string; // String!
    participantId: string; // ID!
    score?: number | null; // Int
  }
  User: { // root type
    address: string; // String!
    cellphone: string; // String!
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    role: NexusGenEnums['UserRole']; // UserRole!
    token?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Match: { // field return type
    awayTeam: string; // String!
    homeTeam: string; // String!
    id: string; // ID!
    officialScore: NexusGenEnums['Score'] | null; // Score
    roomId: string; // ID!
    startDate: string; // String!
    userForecast: NexusGenEnums['Score'] | null; // Score
  }
  MercadoPagoAccessToken: { // field return type
    accessToken: string; // String!
  }
  MercadoPagoPreference: { // field return type
    preferenceId: string; // ID!
    redirectLink: string; // String!
  }
  Mutation: { // field return type
    activateRoom: NexusGenRootTypes['Room']; // Room!
    authenticateUser: NexusGenRootTypes['User']; // User!
    authorizeMercadoPago: NexusGenRootTypes['MercadoPagoAccessToken'] | null; // MercadoPagoAccessToken
    calculateRoomResults: NexusGenRootTypes['RoomParticipantWithScore'][]; // [RoomParticipantWithScore!]!
    changePassword: string | null; // String
    createMatch: NexusGenRootTypes['Match']; // Match!
    createOrUpdateMultipleForecasts: boolean; // Boolean!
    createRoom: NexusGenRootTypes['Room']; // Room!
    deleteMatch: string | null; // String
    deleteRoom: string | null; // String
    disconnectMercadoPagoIntegration: string | null; // String
    generateMercadoPagoPreferenceId: NexusGenRootTypes['MercadoPagoPreference']; // MercadoPagoPreference!
    registerNewUser: NexusGenRootTypes['User']; // User!
    sendResetPasswordEmail: string | null; // String
    updateManyMatchScores: NexusGenRootTypes['Match'][]; // [Match!]!
    updateMatch: NexusGenRootTypes['Match']; // Match!
    updateRoom: NexusGenRootTypes['Room'] | null; // Room
    updateUserData: NexusGenRootTypes['User'] | null; // User
  }
  Participant: { // field return type
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    score: number | null; // Int
  }
  Query: { // field return type
    getActiveUnpaidRooms: NexusGenRootTypes['Room'][]; // [Room!]!
    getMatchesByRoomId: NexusGenRootTypes['Match'][]; // [Match!]!
    getMatchesByRoomIdForPlayers: NexusGenRootTypes['Match'][]; // [Match!]!
    getParticipantsByRoomId: NexusGenRootTypes['Participant'][]; // [Participant!]!
    getPowerBiAccessToken: string; // String!
    getRoomById: NexusGenRootTypes['Room']; // Room!
    getRoomsByUserId: NexusGenRootTypes['Room'][]; // [Room!]!
    getUserMpAccessToken: string | null; // String
    getUserPayedRooms: NexusGenRootTypes['Room'][]; // [Room!]!
    validateToken: boolean; // Boolean!
  }
  Room: { // field return type
    creator: NexusGenRootTypes['User']; // User!
    creatorId: string; // ID!
    dueDate: string; // String!
    entryPrice: number; // Float!
    id: string; // ID!
    isActive: boolean; // Boolean!
    isClosed: boolean; // Boolean!
    name: string; // String!
    participantsCount: number; // Int!
    paymentLink: string; // String!
    prizeMoney: number; // Float!
  }
  RoomParticipantWithScore: { // field return type
    email: string; // String!
    lastName: string; // String!
    name: string; // String!
    participantId: string; // ID!
    score: number | null; // Int
  }
  User: { // field return type
    address: string; // String!
    cellphone: string; // String!
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    role: NexusGenEnums['UserRole']; // UserRole!
    token: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  Match: { // field return type name
    awayTeam: 'String'
    homeTeam: 'String'
    id: 'ID'
    officialScore: 'Score'
    roomId: 'ID'
    startDate: 'String'
    userForecast: 'Score'
  }
  MercadoPagoAccessToken: { // field return type name
    accessToken: 'String'
  }
  MercadoPagoPreference: { // field return type name
    preferenceId: 'ID'
    redirectLink: 'String'
  }
  Mutation: { // field return type name
    activateRoom: 'Room'
    authenticateUser: 'User'
    authorizeMercadoPago: 'MercadoPagoAccessToken'
    calculateRoomResults: 'RoomParticipantWithScore'
    changePassword: 'String'
    createMatch: 'Match'
    createOrUpdateMultipleForecasts: 'Boolean'
    createRoom: 'Room'
    deleteMatch: 'String'
    deleteRoom: 'String'
    disconnectMercadoPagoIntegration: 'String'
    generateMercadoPagoPreferenceId: 'MercadoPagoPreference'
    registerNewUser: 'User'
    sendResetPasswordEmail: 'String'
    updateManyMatchScores: 'Match'
    updateMatch: 'Match'
    updateRoom: 'Room'
    updateUserData: 'User'
  }
  Participant: { // field return type name
    email: 'String'
    firstName: 'String'
    id: 'ID'
    lastName: 'String'
    score: 'Int'
  }
  Query: { // field return type name
    getActiveUnpaidRooms: 'Room'
    getMatchesByRoomId: 'Match'
    getMatchesByRoomIdForPlayers: 'Match'
    getParticipantsByRoomId: 'Participant'
    getPowerBiAccessToken: 'String'
    getRoomById: 'Room'
    getRoomsByUserId: 'Room'
    getUserMpAccessToken: 'String'
    getUserPayedRooms: 'Room'
    validateToken: 'Boolean'
  }
  Room: { // field return type name
    creator: 'User'
    creatorId: 'ID'
    dueDate: 'String'
    entryPrice: 'Float'
    id: 'ID'
    isActive: 'Boolean'
    isClosed: 'Boolean'
    name: 'String'
    participantsCount: 'Int'
    paymentLink: 'String'
    prizeMoney: 'Float'
  }
  RoomParticipantWithScore: { // field return type name
    email: 'String'
    lastName: 'String'
    name: 'String'
    participantId: 'ID'
    score: 'Int'
  }
  User: { // field return type name
    address: 'String'
    cellphone: 'String'
    email: 'String'
    firstName: 'String'
    id: 'ID'
    lastName: 'String'
    role: 'UserRole'
    token: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    activateRoom: { // args
      roomId: string; // String!
    }
    authenticateUser: { // args
      email: string; // String!
      password: string; // String!
    }
    authorizeMercadoPago: { // args
      mercadoPagoCode: string; // String!
    }
    calculateRoomResults: { // args
      roomId: string; // String!
    }
    changePassword: { // args
      newPassword: string; // String!
      token: string; // String!
    }
    createMatch: { // args
      awayTeam: string; // String!
      date: string; // String!
      homeTeam: string; // String!
      roomId: string; // String!
    }
    createOrUpdateMultipleForecasts: { // args
      forecasts: NexusGenInputs['ForecastInput'][]; // [ForecastInput!]!
    }
    createRoom: { // args
      dueDate: string; // String!
      entryPrice: number; // Float!
      isActive: boolean; // Boolean!
      name: string; // String!
      prizeMoney: number; // Float!
    }
    deleteMatch: { // args
      matchId: string; // String!
    }
    deleteRoom: { // args
      roomId: string; // String!
    }
    generateMercadoPagoPreferenceId: { // args
      roomId: string; // String!
    }
    registerNewUser: { // args
      address: string; // String!
      cellphone: string; // String!
      email: string; // String!
      firstName: string; // String!
      lastName: string; // String!
      password: string; // String!
      role: NexusGenEnums['UserRole']; // UserRole!
      termsAccepted: boolean; // Boolean!
    }
    sendResetPasswordEmail: { // args
      email: string; // String!
    }
    updateManyMatchScores: { // args
      scoreUpdates: NexusGenInputs['ScoreUpdateInput'][]; // [ScoreUpdateInput!]!
    }
    updateMatch: { // args
      awayTeam: string; // String!
      date: string; // String!
      homeTeam: string; // String!
      matchId: string; // String!
    }
    updateRoom: { // args
      dueDate: string; // String!
      entryPrice: number; // Float!
      isActive: boolean; // Boolean!
      name: string; // String!
      prizeMoney: number; // Float!
      roomId: string; // String!
    }
    updateUserData: { // args
      address?: string | null; // String
      cellphone?: string | null; // String
      firstName?: string | null; // String
      lastName?: string | null; // String
      newPassword?: string | null; // String
    }
  }
  Query: {
    getMatchesByRoomId: { // args
      roomId: string; // String!
    }
    getMatchesByRoomIdForPlayers: { // args
      roomId: string; // String!
    }
    getParticipantsByRoomId: { // args
      roomId: string; // String!
    }
    getRoomById: { // args
      roomId: string; // String!
    }
    validateToken: { // args
      isResetPassword: boolean; // Boolean!
      token: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}