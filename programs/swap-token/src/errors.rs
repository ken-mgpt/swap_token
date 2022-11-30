use anchor_lang::prelude::*;

#[error_code]
pub enum SwapToken {
  #[msg("init new token has err")]
  InitTokenErr,
}
