export const idlFactory = ({ IDL }) => {
  const Stats = IDL.Record({
    'total_deposits' : IDL.Nat64,
    'total_withdrawals' : IDL.Nat64,
    'unique_users' : IDL.Nat64,
  });
  return IDL.Service({
    'deposit_message' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'get_message_count' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_stats' : IDL.Func([], [Stats], ['query']),
    'verify_message_ownership' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text })],
        ['query'],
      ),
    'withdraw_message' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
