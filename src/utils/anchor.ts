const anchor = require("@project-serum/anchor");
import nexfin from "./nexfin.json";

export const setup = (connection, wallet) => {
    const provider = new anchor.Provider(connection, wallet);
    anchor.setProvider(provider);

    // Address of the deployed program
    const escrowProgramId = new anchor.web3.PublicKey(nexfin.metadata.address);

    // Generate program client from IDL
    const escrowProgram = new anchor.Program(nexfin, escrowProgramId);

    return escrowProgram;
}
