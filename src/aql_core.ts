import {Node, TLBoolean, TLFunction, TLList, TLNil, TLString, TLSymbol, TLType} from "./types";
import {AssetAttributes} from "./aql_types";
import * as JsonOp from "./jsonUtil"
import {prStr} from "./printer";
import {rep} from "./tlisp_repl";

export const ns: Map<TLSymbol, TLFunction> = (() => {
    const ns: { [symbol: string]: typeof TLFunction.prototype.func; } = {
        "asset_create"(assetAttrs: TLType): TLString {
            if(assetAttrs.type != Node.HashMap){
                throw new Error("Expected hash map for attributes")
            }
            let asset:AssetAttributes = new AssetAttributes(assetAttrs.stringMap)
            JsonOp.addAsset(asset)
            return new TLString("Asset created with ID :" + asset.assetId)
        },
        "asset_update"(assetID: TLType, assetAttrs: TLType): TLString {
            if(assetID.type != Node.String){
                throw new Error("Bad Asset Id")
            }
            if(assetAttrs.type != Node.HashMap){
                throw new Error("Expected hash map for attributes")
            }

            JsonOp.updateData(assetID.v, assetAttrs.stringMap)

            return new TLString("Updated attributes for assetId: "+assetID.v)
        },
        "asset_versions"(assetID: TLType):TLList {
            if(assetID.type != Node.String){
                throw new Error("Bad Asset Id")
            }
            let versions:string[] = JsonOp.getAsset(assetID.v)
            console.log(versions)
            let p:TLString[] = versions.map(v => new TLString(v))
            //console.log(p)
            return new TLList(p);
        }
    };

    const map = new Map<TLSymbol, TLFunction>();
    Object.keys(ns).forEach(key => map.set(TLSymbol.get(key), TLFunction.fromBootstrap(ns[key])));
    return map;
})();


/*
asset_create, asset_update/transfer, asset_retire

asset_lineage
v1:create
v2:retired


asset_create -> List() -> updateCSV()
a,b,c
{attr:val, attr1:val1}

 */