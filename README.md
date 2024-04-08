# swap_token
a project allow create a custom token, swap new token with sol

# check_list
- create a token with mint_authority is a PDA of program
- allow swap token mean user transfer to PDA (or admin who create token) sol to get new token
- add test for program

# run test
- test with js
```
yarn swap-token-test
```

- test with cargo
```angular2html
cargo test
```

# command:
- programId: FYLshD5yWikqKSxRc6wCn1Y3Dtm3auoXa29zLPuXbos8 
  - on devnet && testnet
- create token
  - tx example (on devnet): 4LvtVpPisTH6wpqtSX2U62nkES1WFg55xF7WKDhYbCvCjEKpbFPdyquWiQBw4xHb6JfDEaFqHK42B8XekiaXtYeF
  - token address (devent): 65dCgphWTcHh2MrxcHpBRTwcFveH6zTWFXUKbHfYUxMP
```angular2html
env DEBUG=swap-token:* ts-node app/command-line/swap-token-cli.ts initToken -k <adminwallet keypath> -d <decimals> -e <endpoint devnet>
``` 

- swap token (use mint to)
  - tx example (on devnet): 5nkP7Tz18UR9A6nGLzv8orY2E8VLjRnfuPfNtdGTi56yKezeF4KxfCe54Cwuri33qwsutYzjG31rpGdaseAHktB4
```angular2html
env DEBUG=swap-token:* ts-node app/command-line/swap-token-cli.ts swapToken -k <keyPath> -m <TokenAddress> -a <SolTransfer> -e <endpoint devnet>
```

# Note
- Do không có yêu cầu cụ, để có thể swap tỉ lệ với sol dễ dàng nên sẽ chọn decimals của các token test là 9 (giống với của sol)
- Không rõ ràng việc swap ở đây sẽ user sẽ được mintTo token (nghĩa là token sẽ được chuyển quyền mint cho program) hay sẽ được transfer (program sẽ sở hữu 1 PDA chứa 1 lượng token phục vụ việc transfer) => chọn việc program cho phép tạo token tương ứng và sẽ sử dụng trường hợp mintTo
- Việc transfer sol có thể transfer về 1 PDA trên program và cho phép adminWallet claim về hoặc transfer thẳng cho adminwallet => ở đây sẽ chọn cách thức transfer thẳng cho admin wallet
- Hoàn toàn có thể tạo thêm PDA lưu lại trạng thái của program cho phép pause program trong trường hợp cần thiết, cũng như lưu lại admin wallet (wallet sẽ nhận sol) ngay trên program nếu cần thiết
- Do không có trao đổi rõ ràng về requirement cũng như các yêu cầu security nên có thể đã miss 1 số case bảo mật