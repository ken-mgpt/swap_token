pub fn caculate_token_sended(sol_payed: u64) -> u64 {
    sol_payed.checked_mul(10).unwrap()
}
#[cfg(test)]
mod tests {
    // Note this useful idiom: importing names from outer (for mod tests) scope.
    use super::*;

    #[test]
    fn test_caculate_token_sended() {
        assert_eq!(caculate_token_sended(1000000000), 10000000000);
    }
}
