// package: iroha.protocol
// file: commands.proto

import * as jspb from "google-protobuf";
import * as primitive_pb from "./primitive_pb";

export class AddAssetQuantity extends jspb.Message {
  getAssetId(): string;
  setAssetId(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddAssetQuantity.AsObject;
  static toObject(includeInstance: boolean, msg: AddAssetQuantity): AddAssetQuantity.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddAssetQuantity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddAssetQuantity;
  static deserializeBinaryFromReader(message: AddAssetQuantity, reader: jspb.BinaryReader): AddAssetQuantity;
}

export namespace AddAssetQuantity {
  export type AsObject = {
    assetId: string,
    amount: string,
    description: string,
  }
}

export class AddPeer extends jspb.Message {
  hasPeer(): boolean;
  clearPeer(): void;
  getPeer(): primitive_pb.Peer | undefined;
  setPeer(value?: primitive_pb.Peer): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddPeer.AsObject;
  static toObject(includeInstance: boolean, msg: AddPeer): AddPeer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddPeer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddPeer;
  static deserializeBinaryFromReader(message: AddPeer, reader: jspb.BinaryReader): AddPeer;
}

export namespace AddPeer {
  export type AsObject = {
    peer?: primitive_pb.Peer.AsObject,
  }
}

export class RemovePeer extends jspb.Message {
  getPublicKey(): string;
  setPublicKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemovePeer.AsObject;
  static toObject(includeInstance: boolean, msg: RemovePeer): RemovePeer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemovePeer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemovePeer;
  static deserializeBinaryFromReader(message: RemovePeer, reader: jspb.BinaryReader): RemovePeer;
}

export namespace RemovePeer {
  export type AsObject = {
    publicKey: string,
  }
}

export class AddSignatory extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getPublicKey(): string;
  setPublicKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddSignatory.AsObject;
  static toObject(includeInstance: boolean, msg: AddSignatory): AddSignatory.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddSignatory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddSignatory;
  static deserializeBinaryFromReader(message: AddSignatory, reader: jspb.BinaryReader): AddSignatory;
}

export namespace AddSignatory {
  export type AsObject = {
    accountId: string,
    publicKey: string,
  }
}

export class CreateAsset extends jspb.Message {
  getAssetName(): string;
  setAssetName(value: string): void;

  getDomainId(): string;
  setDomainId(value: string): void;

  getPrecision(): number;
  setPrecision(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAsset.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAsset): CreateAsset.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateAsset, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAsset;
  static deserializeBinaryFromReader(message: CreateAsset, reader: jspb.BinaryReader): CreateAsset;
}

export namespace CreateAsset {
  export type AsObject = {
    assetName: string,
    domainId: string,
    precision: number,
  }
}

export class CreateAccount extends jspb.Message {
  getAccountName(): string;
  setAccountName(value: string): void;

  getDomainId(): string;
  setDomainId(value: string): void;

  getPublicKey(): string;
  setPublicKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAccount.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAccount): CreateAccount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateAccount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAccount;
  static deserializeBinaryFromReader(message: CreateAccount, reader: jspb.BinaryReader): CreateAccount;
}

export namespace CreateAccount {
  export type AsObject = {
    accountName: string,
    domainId: string,
    publicKey: string,
  }
}

export class SetAccountDetail extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetAccountDetail.AsObject;
  static toObject(includeInstance: boolean, msg: SetAccountDetail): SetAccountDetail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetAccountDetail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetAccountDetail;
  static deserializeBinaryFromReader(message: SetAccountDetail, reader: jspb.BinaryReader): SetAccountDetail;
}

export namespace SetAccountDetail {
  export type AsObject = {
    accountId: string,
    key: string,
    value: string,
  }
}

export class CreateDomain extends jspb.Message {
  getDomainId(): string;
  setDomainId(value: string): void;

  getDefaultRole(): string;
  setDefaultRole(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDomain.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDomain): CreateDomain.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateDomain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDomain;
  static deserializeBinaryFromReader(message: CreateDomain, reader: jspb.BinaryReader): CreateDomain;
}

export namespace CreateDomain {
  export type AsObject = {
    domainId: string,
    defaultRole: string,
  }
}

export class RemoveSignatory extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getPublicKey(): string;
  setPublicKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveSignatory.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveSignatory): RemoveSignatory.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveSignatory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveSignatory;
  static deserializeBinaryFromReader(message: RemoveSignatory, reader: jspb.BinaryReader): RemoveSignatory;
}

export namespace RemoveSignatory {
  export type AsObject = {
    accountId: string,
    publicKey: string,
  }
}

export class SetAccountQuorum extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getQuorum(): number;
  setQuorum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetAccountQuorum.AsObject;
  static toObject(includeInstance: boolean, msg: SetAccountQuorum): SetAccountQuorum.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetAccountQuorum, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetAccountQuorum;
  static deserializeBinaryFromReader(message: SetAccountQuorum, reader: jspb.BinaryReader): SetAccountQuorum;
}

export namespace SetAccountQuorum {
  export type AsObject = {
    accountId: string,
    quorum: number,
  }
}

export class TransferAsset extends jspb.Message {
  getSrcAccountId(): string;
  setSrcAccountId(value: string): void;

  getDestAccountId(): string;
  setDestAccountId(value: string): void;

  getAssetId(): string;
  setAssetId(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferAsset.AsObject;
  static toObject(includeInstance: boolean, msg: TransferAsset): TransferAsset.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferAsset, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferAsset;
  static deserializeBinaryFromReader(message: TransferAsset, reader: jspb.BinaryReader): TransferAsset;
}

export namespace TransferAsset {
  export type AsObject = {
    srcAccountId: string,
    destAccountId: string,
    assetId: string,
    description: string,
    amount: string,
  }
}

export class AppendRole extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getRoleName(): string;
  setRoleName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AppendRole.AsObject;
  static toObject(includeInstance: boolean, msg: AppendRole): AppendRole.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AppendRole, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AppendRole;
  static deserializeBinaryFromReader(message: AppendRole, reader: jspb.BinaryReader): AppendRole;
}

export namespace AppendRole {
  export type AsObject = {
    accountId: string,
    roleName: string,
  }
}

export class DetachRole extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getRoleName(): string;
  setRoleName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetachRole.AsObject;
  static toObject(includeInstance: boolean, msg: DetachRole): DetachRole.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetachRole, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetachRole;
  static deserializeBinaryFromReader(message: DetachRole, reader: jspb.BinaryReader): DetachRole;
}

export namespace DetachRole {
  export type AsObject = {
    accountId: string,
    roleName: string,
  }
}

export class CreateRole extends jspb.Message {
  getRoleName(): string;
  setRoleName(value: string): void;

  clearPermissionsList(): void;
  getPermissionsList(): Array<primitive_pb.RolePermissionMap[keyof primitive_pb.RolePermissionMap]>;
  setPermissionsList(value: Array<primitive_pb.RolePermissionMap[keyof primitive_pb.RolePermissionMap]>): void;
  addPermissions(value: primitive_pb.RolePermissionMap[keyof primitive_pb.RolePermissionMap], index?: number): primitive_pb.RolePermissionMap[keyof primitive_pb.RolePermissionMap];

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateRole.AsObject;
  static toObject(includeInstance: boolean, msg: CreateRole): CreateRole.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateRole, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateRole;
  static deserializeBinaryFromReader(message: CreateRole, reader: jspb.BinaryReader): CreateRole;
}

export namespace CreateRole {
  export type AsObject = {
    roleName: string,
    permissionsList: Array<primitive_pb.RolePermissionMap[keyof primitive_pb.RolePermissionMap]>,
  }
}

export class GrantPermission extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getPermission(): primitive_pb.GrantablePermissionMap[keyof primitive_pb.GrantablePermissionMap];
  setPermission(value: primitive_pb.GrantablePermissionMap[keyof primitive_pb.GrantablePermissionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GrantPermission.AsObject;
  static toObject(includeInstance: boolean, msg: GrantPermission): GrantPermission.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GrantPermission, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GrantPermission;
  static deserializeBinaryFromReader(message: GrantPermission, reader: jspb.BinaryReader): GrantPermission;
}

export namespace GrantPermission {
  export type AsObject = {
    accountId: string,
    permission: primitive_pb.GrantablePermissionMap[keyof primitive_pb.GrantablePermissionMap],
  }
}

export class RevokePermission extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getPermission(): primitive_pb.GrantablePermissionMap[keyof primitive_pb.GrantablePermissionMap];
  setPermission(value: primitive_pb.GrantablePermissionMap[keyof primitive_pb.GrantablePermissionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RevokePermission.AsObject;
  static toObject(includeInstance: boolean, msg: RevokePermission): RevokePermission.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RevokePermission, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RevokePermission;
  static deserializeBinaryFromReader(message: RevokePermission, reader: jspb.BinaryReader): RevokePermission;
}

export namespace RevokePermission {
  export type AsObject = {
    accountId: string,
    permission: primitive_pb.GrantablePermissionMap[keyof primitive_pb.GrantablePermissionMap],
  }
}

export class SubtractAssetQuantity extends jspb.Message {
  getAssetId(): string;
  setAssetId(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubtractAssetQuantity.AsObject;
  static toObject(includeInstance: boolean, msg: SubtractAssetQuantity): SubtractAssetQuantity.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubtractAssetQuantity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubtractAssetQuantity;
  static deserializeBinaryFromReader(message: SubtractAssetQuantity, reader: jspb.BinaryReader): SubtractAssetQuantity;
}

export namespace SubtractAssetQuantity {
  export type AsObject = {
    assetId: string,
    amount: string,
    description: string,
  }
}

export class CompareAndSetAccountDetail extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  hasOldValue(): boolean;
  clearOldValue(): void;
  getOldValue(): string;
  setOldValue(value: string): void;

  getCheckEmpty(): boolean;
  setCheckEmpty(value: boolean): void;

  getOptOldValueCase(): CompareAndSetAccountDetail.OptOldValueCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompareAndSetAccountDetail.AsObject;
  static toObject(includeInstance: boolean, msg: CompareAndSetAccountDetail): CompareAndSetAccountDetail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CompareAndSetAccountDetail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompareAndSetAccountDetail;
  static deserializeBinaryFromReader(message: CompareAndSetAccountDetail, reader: jspb.BinaryReader): CompareAndSetAccountDetail;
}

export namespace CompareAndSetAccountDetail {
  export type AsObject = {
    accountId: string,
    key: string,
    value: string,
    oldValue: string,
    checkEmpty: boolean,
  }

  export enum OptOldValueCase {
    OPT_OLD_VALUE_NOT_SET = 0,
    OLD_VALUE = 4,
  }
}

export class SetSettingValue extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSettingValue.AsObject;
  static toObject(includeInstance: boolean, msg: SetSettingValue): SetSettingValue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetSettingValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSettingValue;
  static deserializeBinaryFromReader(message: SetSettingValue, reader: jspb.BinaryReader): SetSettingValue;
}

export namespace SetSettingValue {
  export type AsObject = {
    key: string,
    value: string,
  }
}

export class CallEngine extends jspb.Message {
  getType(): CallEngine.EngineTypeMap[keyof CallEngine.EngineTypeMap];
  setType(value: CallEngine.EngineTypeMap[keyof CallEngine.EngineTypeMap]): void;

  getCaller(): string;
  setCaller(value: string): void;

  hasCallee(): boolean;
  clearCallee(): void;
  getCallee(): string;
  setCallee(value: string): void;

  getInput(): string;
  setInput(value: string): void;

  getOptCalleeCase(): CallEngine.OptCalleeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CallEngine.AsObject;
  static toObject(includeInstance: boolean, msg: CallEngine): CallEngine.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CallEngine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CallEngine;
  static deserializeBinaryFromReader(message: CallEngine, reader: jspb.BinaryReader): CallEngine;
}

export namespace CallEngine {
  export type AsObject = {
    type: CallEngine.EngineTypeMap[keyof CallEngine.EngineTypeMap],
    caller: string,
    callee: string,
    input: string,
  }

  export interface EngineTypeMap {
    KSOLIDITY: 0;
  }

  export const EngineType: EngineTypeMap;

  export enum OptCalleeCase {
    OPT_CALLEE_NOT_SET = 0,
    CALLEE = 3,
  }
}

export class Command extends jspb.Message {
  hasAddAssetQuantity(): boolean;
  clearAddAssetQuantity(): void;
  getAddAssetQuantity(): AddAssetQuantity | undefined;
  setAddAssetQuantity(value?: AddAssetQuantity): void;

  hasAddPeer(): boolean;
  clearAddPeer(): void;
  getAddPeer(): AddPeer | undefined;
  setAddPeer(value?: AddPeer): void;

  hasAddSignatory(): boolean;
  clearAddSignatory(): void;
  getAddSignatory(): AddSignatory | undefined;
  setAddSignatory(value?: AddSignatory): void;

  hasAppendRole(): boolean;
  clearAppendRole(): void;
  getAppendRole(): AppendRole | undefined;
  setAppendRole(value?: AppendRole): void;

  hasCreateAccount(): boolean;
  clearCreateAccount(): void;
  getCreateAccount(): CreateAccount | undefined;
  setCreateAccount(value?: CreateAccount): void;

  hasCreateAsset(): boolean;
  clearCreateAsset(): void;
  getCreateAsset(): CreateAsset | undefined;
  setCreateAsset(value?: CreateAsset): void;

  hasCreateDomain(): boolean;
  clearCreateDomain(): void;
  getCreateDomain(): CreateDomain | undefined;
  setCreateDomain(value?: CreateDomain): void;

  hasCreateRole(): boolean;
  clearCreateRole(): void;
  getCreateRole(): CreateRole | undefined;
  setCreateRole(value?: CreateRole): void;

  hasDetachRole(): boolean;
  clearDetachRole(): void;
  getDetachRole(): DetachRole | undefined;
  setDetachRole(value?: DetachRole): void;

  hasGrantPermission(): boolean;
  clearGrantPermission(): void;
  getGrantPermission(): GrantPermission | undefined;
  setGrantPermission(value?: GrantPermission): void;

  hasRemoveSignatory(): boolean;
  clearRemoveSignatory(): void;
  getRemoveSignatory(): RemoveSignatory | undefined;
  setRemoveSignatory(value?: RemoveSignatory): void;

  hasRevokePermission(): boolean;
  clearRevokePermission(): void;
  getRevokePermission(): RevokePermission | undefined;
  setRevokePermission(value?: RevokePermission): void;

  hasSetAccountDetail(): boolean;
  clearSetAccountDetail(): void;
  getSetAccountDetail(): SetAccountDetail | undefined;
  setSetAccountDetail(value?: SetAccountDetail): void;

  hasSetAccountQuorum(): boolean;
  clearSetAccountQuorum(): void;
  getSetAccountQuorum(): SetAccountQuorum | undefined;
  setSetAccountQuorum(value?: SetAccountQuorum): void;

  hasSubtractAssetQuantity(): boolean;
  clearSubtractAssetQuantity(): void;
  getSubtractAssetQuantity(): SubtractAssetQuantity | undefined;
  setSubtractAssetQuantity(value?: SubtractAssetQuantity): void;

  hasTransferAsset(): boolean;
  clearTransferAsset(): void;
  getTransferAsset(): TransferAsset | undefined;
  setTransferAsset(value?: TransferAsset): void;

  hasRemovePeer(): boolean;
  clearRemovePeer(): void;
  getRemovePeer(): RemovePeer | undefined;
  setRemovePeer(value?: RemovePeer): void;

  hasCompareAndSetAccountDetail(): boolean;
  clearCompareAndSetAccountDetail(): void;
  getCompareAndSetAccountDetail(): CompareAndSetAccountDetail | undefined;
  setCompareAndSetAccountDetail(value?: CompareAndSetAccountDetail): void;

  hasSetSettingValue(): boolean;
  clearSetSettingValue(): void;
  getSetSettingValue(): SetSettingValue | undefined;
  setSetSettingValue(value?: SetSettingValue): void;

  hasCallEngine(): boolean;
  clearCallEngine(): void;
  getCallEngine(): CallEngine | undefined;
  setCallEngine(value?: CallEngine): void;

  getCommandCase(): Command.CommandCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Command.AsObject;
  static toObject(includeInstance: boolean, msg: Command): Command.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Command, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Command;
  static deserializeBinaryFromReader(message: Command, reader: jspb.BinaryReader): Command;
}

export namespace Command {
  export type AsObject = {
    addAssetQuantity?: AddAssetQuantity.AsObject,
    addPeer?: AddPeer.AsObject,
    addSignatory?: AddSignatory.AsObject,
    appendRole?: AppendRole.AsObject,
    createAccount?: CreateAccount.AsObject,
    createAsset?: CreateAsset.AsObject,
    createDomain?: CreateDomain.AsObject,
    createRole?: CreateRole.AsObject,
    detachRole?: DetachRole.AsObject,
    grantPermission?: GrantPermission.AsObject,
    removeSignatory?: RemoveSignatory.AsObject,
    revokePermission?: RevokePermission.AsObject,
    setAccountDetail?: SetAccountDetail.AsObject,
    setAccountQuorum?: SetAccountQuorum.AsObject,
    subtractAssetQuantity?: SubtractAssetQuantity.AsObject,
    transferAsset?: TransferAsset.AsObject,
    removePeer?: RemovePeer.AsObject,
    compareAndSetAccountDetail?: CompareAndSetAccountDetail.AsObject,
    setSettingValue?: SetSettingValue.AsObject,
    callEngine?: CallEngine.AsObject,
  }

  export enum CommandCase {
    COMMAND_NOT_SET = 0,
    ADD_ASSET_QUANTITY = 1,
    ADD_PEER = 2,
    ADD_SIGNATORY = 3,
    APPEND_ROLE = 4,
    CREATE_ACCOUNT = 5,
    CREATE_ASSET = 6,
    CREATE_DOMAIN = 7,
    CREATE_ROLE = 8,
    DETACH_ROLE = 9,
    GRANT_PERMISSION = 10,
    REMOVE_SIGNATORY = 11,
    REVOKE_PERMISSION = 12,
    SET_ACCOUNT_DETAIL = 13,
    SET_ACCOUNT_QUORUM = 14,
    SUBTRACT_ASSET_QUANTITY = 15,
    TRANSFER_ASSET = 16,
    REMOVE_PEER = 17,
    COMPARE_AND_SET_ACCOUNT_DETAIL = 18,
    SET_SETTING_VALUE = 19,
    CALL_ENGINE = 20,
  }
}

