import { ManagerAppDepInstallRequired } from '@ledgerhq/errors';
import {
    createTokenSwap,
    swap,
    depositAllTokenTypes,
    withdrawAllTokenTypes,
    depositSingleTokenTypeExactAmountIn,
    withdrawSingleTokenTypeExactAmountOut,
} from '../swapPool'
import { CurveType, Numberu64 } from '../tokenSwap';


async function main() {
    console.log(
        'CreateTokenSwap (constant product)',
    );
    await createTokenSwap(CurveType.ConstantProduct, this.$wallet);
}

// run through cli
main().catch(err => {
    console.error(err);
    process.exit(-1)
}).then(() => process.exit())