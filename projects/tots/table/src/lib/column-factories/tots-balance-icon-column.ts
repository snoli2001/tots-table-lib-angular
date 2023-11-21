import { BalanceCurrencyIconColumnComponent } from "../../public-api";
import { TotsColumn, TotsColumnOrder } from "../entities/tots-column";

export class TotsBalanceIconColumn extends TotsColumn {
	constructor(id:string, activeAssetFieldKey:string, passiveAssetFieldKey:string, neutralIcon:string, positiveIcon:string, negativeIcon:string, title?:string, hasOrder?:boolean, order?:TotsColumnOrder) {
        super(id, BalanceCurrencyIconColumnComponent, undefined, title, hasOrder, order);
        this.extra = {
            field_key_credit: activeAssetFieldKey,
            field_key_debit: passiveAssetFieldKey,
            icon_neutral: neutralIcon,
            icon_positive: positiveIcon,
            icon_negative: negativeIcon
        }
    }
}