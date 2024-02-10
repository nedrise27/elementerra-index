# elementerra-index

## API available at https://elementerra.line27.de

## index attempt of Elementerra forging data

I have no clue what i'm doing. I just learned all the Solana stuff while building this.
As always, take everything with a grain of salt.

If you want to contribute just open an issue or write me an email: ned.rise.io@gmail.com

Happy crafting!

## Assertions about how the game works:

if elementerra program gets called with data "J1gU5gpUd3E" => ClaimPendingGuess
if elementerra program gets called with data starting with "FTDA" => AddToPendingGuess

If any tokenTransfer where
  toUserAccount == feePayer => successful
  else unsuccessful
