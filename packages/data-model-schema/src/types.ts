import { z } from 'zod'

// TODO

// const TypePath = z.string().brand('TypePath')
//
// const Schema = z.record(z.union([
//   z.object({ Map: z.object({ key: TypePath, value: TypePath})}),
//  z.object({ })
// ]))

export interface Schema {
  [type: string]: SchemaTypeDefinition
}

export type SchemaTypeDefinition =
  | UnitType
  | DirectAlias
  | MapDefinition
  | VecDefinition
  | OptionDefinition
  | NamedStructDefinition
  | EnumDefinition
  | ArrayDefinition
  | IntDefinition
  | TupleDefinition
  | BitmapDefinition

export interface MapDefinition {
  Map: {
    key: TypePath
    value: TypePath
  }
}

export interface TupleDefinition {
  Tuple: TypePath[]
}

export type DirectAlias = TypePath

export interface VecDefinition {
  Vec: TypePath
}

export interface ArrayDefinition {
  Array: {
    len: number
    type: TypePath
  }
}

export interface OptionDefinition {
  Option: TypePath
}

export interface NamedStructDefinition {
  Struct: Array<{
    name: string
    type: TypePath
  }>
}

export interface EnumDefinition {
  Enum: Array<EnumVariantDefinition>
}

export interface EnumVariantDefinition {
  tag: string
  discriminant: number
  type?: TypePath
}

export interface IntDefinition {
  Int: string
}

export interface BitmapDefinition {
  Bitmap: {
    repr: string
    masks: { name: string; mask: number }[]
  }
}

export type TypePath = string

export type UnitType = null
