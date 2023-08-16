/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../context"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
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
  MercadoPagoAccessToken: { // root type
    accessToken: string; // String!
  }
  MercadoPagoPreference: { // root type
    preferenceId: string; // ID!
  }
  Mutation: {};
  Query: {};
  Room: { // root type
    dueDate: string; // String!
    entryPrice: number; // Float!
    id: string; // ID!
    isActive: boolean; // Boolean!
    name: string; // String!
    paymentLink: string; // String!
    prizeMoney: number; // Float!
  }
  User: { // root type
    address: string; // String!
    cellphone: string; // String!
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    role: NexusGenEnums['UserRole']; // UserRole!
    token: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  MercadoPagoAccessToken: { // field return type
    accessToken: string; // String!
  }
  MercadoPagoPreference: { // field return type
    preferenceId: string; // ID!
  }
  Mutation: { // field return type
    authenticateUser: NexusGenRootTypes['User']; // User!
    authorizeMercadoPago: NexusGenRootTypes['MercadoPagoAccessToken'] | null; // MercadoPagoAccessToken
    changePassword: string | null; // String
    createRoom: NexusGenRootTypes['Room']; // Room!
    disconnectMercadoPagoIntegration: string | null; // String
    registerNewUser: NexusGenRootTypes['User']; // User!
    sendResetPasswordEmail: string | null; // String
  }
  Query: { // field return type
    getRoomsByUserId: NexusGenRootTypes['Room'][]; // [Room!]!
    getUserMpAccessToken: string | null; // String
    validateToken: boolean; // Boolean!
  }
  Room: { // field return type
    dueDate: string; // String!
    entryPrice: number; // Float!
    id: string; // ID!
    isActive: boolean; // Boolean!
    name: string; // String!
    paymentLink: string; // String!
    prizeMoney: number; // Float!
  }
  User: { // field return type
    address: string; // String!
    cellphone: string; // String!
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    role: NexusGenEnums['UserRole']; // UserRole!
    token: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  MercadoPagoAccessToken: { // field return type name
    accessToken: 'String'
  }
  MercadoPagoPreference: { // field return type name
    preferenceId: 'ID'
  }
  Mutation: { // field return type name
    authenticateUser: 'User'
    authorizeMercadoPago: 'MercadoPagoAccessToken'
    changePassword: 'String'
    createRoom: 'Room'
    disconnectMercadoPagoIntegration: 'String'
    registerNewUser: 'User'
    sendResetPasswordEmail: 'String'
  }
  Query: { // field return type name
    getRoomsByUserId: 'Room'
    getUserMpAccessToken: 'String'
    validateToken: 'Boolean'
  }
  Room: { // field return type name
    dueDate: 'String'
    entryPrice: 'Float'
    id: 'ID'
    isActive: 'Boolean'
    name: 'String'
    paymentLink: 'String'
    prizeMoney: 'Float'
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
    authenticateUser: { // args
      email: string; // String!
      password: string; // String!
    }
    authorizeMercadoPago: { // args
      mercadoPagoCode: string; // String!
    }
    changePassword: { // args
      newPassword: string; // String!
      token: string; // String!
    }
    createRoom: { // args
      dueDate: string; // String!
      entryPrice: number; // Float!
      isActive: boolean; // Boolean!
      name: string; // String!
      prizeMoney: number; // Float!
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
  }
  Query: {
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

export type NexusGenInputNames = never;

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