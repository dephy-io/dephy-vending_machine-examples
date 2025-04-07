//! This code was AUTOGENERATED using the codama library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun codama to update it.
//!
//! <https://github.com/codama-idl/codama>
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
#[derive(Debug)]
pub struct CreateNamespace {
    pub global_account: solana_program::pubkey::Pubkey,

    pub namespace_account: solana_program::pubkey::Pubkey,

    pub authority: solana_program::pubkey::Pubkey,

    pub treasury: solana_program::pubkey::Pubkey,

    pub bot: solana_program::pubkey::Pubkey,

    pub payer: solana_program::pubkey::Pubkey,

    pub system_program: solana_program::pubkey::Pubkey,
}

impl CreateNamespace {
    pub fn instruction(
        &self,
        args: CreateNamespaceInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::arithmetic_side_effects)]
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: CreateNamespaceInstructionArgs,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(7 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.global_account,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.namespace_account,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.authority,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.treasury,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.bot, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.payer, true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false,
        ));
        accounts.extend_from_slice(remaining_accounts);
        let mut data = borsh::to_vec(&CreateNamespaceInstructionData::new()).unwrap();
        let mut args = borsh::to_vec(&args).unwrap();
        data.append(&mut args);

        solana_program::instruction::Instruction {
            program_id: crate::BALANCE_PAYMENT_ID,
            accounts,
            data,
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CreateNamespaceInstructionData {
    discriminator: [u8; 8],
}

impl CreateNamespaceInstructionData {
    pub fn new() -> Self {
        Self {
            discriminator: [205, 189, 35, 255, 214, 116, 25, 107],
        }
    }
}

impl Default for CreateNamespaceInstructionData {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CreateNamespaceInstructionArgs {
    pub name: String,
}

/// Instruction builder for `CreateNamespace`.
///
/// ### Accounts:
///
///   0. `[writable]` global_account
///   1. `[writable]` namespace_account
///   2. `[]` authority
///   3. `[]` treasury
///   4. `[]` bot
///   5. `[writable, signer]` payer
///   6. `[optional]` system_program (default to `11111111111111111111111111111111`)
#[derive(Clone, Debug, Default)]
pub struct CreateNamespaceBuilder {
    global_account: Option<solana_program::pubkey::Pubkey>,
    namespace_account: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
    treasury: Option<solana_program::pubkey::Pubkey>,
    bot: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    name: Option<String>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl CreateNamespaceBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    #[inline(always)]
    pub fn global_account(&mut self, global_account: solana_program::pubkey::Pubkey) -> &mut Self {
        self.global_account = Some(global_account);
        self
    }
    #[inline(always)]
    pub fn namespace_account(
        &mut self,
        namespace_account: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.namespace_account = Some(namespace_account);
        self
    }
    #[inline(always)]
    pub fn authority(&mut self, authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.authority = Some(authority);
        self
    }
    #[inline(always)]
    pub fn treasury(&mut self, treasury: solana_program::pubkey::Pubkey) -> &mut Self {
        self.treasury = Some(treasury);
        self
    }
    #[inline(always)]
    pub fn bot(&mut self, bot: solana_program::pubkey::Pubkey) -> &mut Self {
        self.bot = Some(bot);
        self
    }
    #[inline(always)]
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    /// `[optional account, default to '11111111111111111111111111111111']`
    #[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    #[inline(always)]
    pub fn name(&mut self, name: String) -> &mut Self {
        self.name = Some(name);
        self
    }
    /// Add an additional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: solana_program::instruction::AccountMeta,
    ) -> &mut Self {
        self.__remaining_accounts.push(account);
        self
    }
    /// Add additional accounts to the instruction.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[solana_program::instruction::AccountMeta],
    ) -> &mut Self {
        self.__remaining_accounts.extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let accounts = CreateNamespace {
            global_account: self.global_account.expect("global_account is not set"),
            namespace_account: self
                .namespace_account
                .expect("namespace_account is not set"),
            authority: self.authority.expect("authority is not set"),
            treasury: self.treasury.expect("treasury is not set"),
            bot: self.bot.expect("bot is not set"),
            payer: self.payer.expect("payer is not set"),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
        };
        let args = CreateNamespaceInstructionArgs {
            name: self.name.clone().expect("name is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `create_namespace` CPI accounts.
pub struct CreateNamespaceCpiAccounts<'a, 'b> {
    pub global_account: &'b solana_program::account_info::AccountInfo<'a>,

    pub namespace_account: &'b solana_program::account_info::AccountInfo<'a>,

    pub authority: &'b solana_program::account_info::AccountInfo<'a>,

    pub treasury: &'b solana_program::account_info::AccountInfo<'a>,

    pub bot: &'b solana_program::account_info::AccountInfo<'a>,

    pub payer: &'b solana_program::account_info::AccountInfo<'a>,

    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
}

/// `create_namespace` CPI instruction.
pub struct CreateNamespaceCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,

    pub global_account: &'b solana_program::account_info::AccountInfo<'a>,

    pub namespace_account: &'b solana_program::account_info::AccountInfo<'a>,

    pub authority: &'b solana_program::account_info::AccountInfo<'a>,

    pub treasury: &'b solana_program::account_info::AccountInfo<'a>,

    pub bot: &'b solana_program::account_info::AccountInfo<'a>,

    pub payer: &'b solana_program::account_info::AccountInfo<'a>,

    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// The arguments for the instruction.
    pub __args: CreateNamespaceInstructionArgs,
}

impl<'a, 'b> CreateNamespaceCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: CreateNamespaceCpiAccounts<'a, 'b>,
        args: CreateNamespaceInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            global_account: accounts.global_account,
            namespace_account: accounts.namespace_account,
            authority: accounts.authority,
            treasury: accounts.treasury,
            bot: accounts.bot,
            payer: accounts.payer,
            system_program: accounts.system_program,
            __args: args,
        }
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], &[])
    }
    #[inline(always)]
    pub fn invoke_with_remaining_accounts(
        &self,
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], remaining_accounts)
    }
    #[inline(always)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(signers_seeds, &[])
    }
    #[allow(clippy::arithmetic_side_effects)]
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed_with_remaining_accounts(
        &self,
        signers_seeds: &[&[&[u8]]],
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(7 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.global_account.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.namespace_account.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.authority.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.treasury.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.bot.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.payer.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.system_program.key,
            false,
        ));
        remaining_accounts.iter().for_each(|remaining_account| {
            accounts.push(solana_program::instruction::AccountMeta {
                pubkey: *remaining_account.0.key,
                is_signer: remaining_account.1,
                is_writable: remaining_account.2,
            })
        });
        let mut data = borsh::to_vec(&CreateNamespaceInstructionData::new()).unwrap();
        let mut args = borsh::to_vec(&self.__args).unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::BALANCE_PAYMENT_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(8 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.global_account.clone());
        account_infos.push(self.namespace_account.clone());
        account_infos.push(self.authority.clone());
        account_infos.push(self.treasury.clone());
        account_infos.push(self.bot.clone());
        account_infos.push(self.payer.clone());
        account_infos.push(self.system_program.clone());
        remaining_accounts
            .iter()
            .for_each(|remaining_account| account_infos.push(remaining_account.0.clone()));

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// Instruction builder for `CreateNamespace` via CPI.
///
/// ### Accounts:
///
///   0. `[writable]` global_account
///   1. `[writable]` namespace_account
///   2. `[]` authority
///   3. `[]` treasury
///   4. `[]` bot
///   5. `[writable, signer]` payer
///   6. `[]` system_program
#[derive(Clone, Debug)]
pub struct CreateNamespaceCpiBuilder<'a, 'b> {
    instruction: Box<CreateNamespaceCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> CreateNamespaceCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(CreateNamespaceCpiBuilderInstruction {
            __program: program,
            global_account: None,
            namespace_account: None,
            authority: None,
            treasury: None,
            bot: None,
            payer: None,
            system_program: None,
            name: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    #[inline(always)]
    pub fn global_account(
        &mut self,
        global_account: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.global_account = Some(global_account);
        self
    }
    #[inline(always)]
    pub fn namespace_account(
        &mut self,
        namespace_account: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.namespace_account = Some(namespace_account);
        self
    }
    #[inline(always)]
    pub fn authority(
        &mut self,
        authority: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.authority = Some(authority);
        self
    }
    #[inline(always)]
    pub fn treasury(
        &mut self,
        treasury: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.treasury = Some(treasury);
        self
    }
    #[inline(always)]
    pub fn bot(&mut self, bot: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.bot = Some(bot);
        self
    }
    #[inline(always)]
    pub fn payer(&mut self, payer: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.payer = Some(payer);
        self
    }
    #[inline(always)]
    pub fn system_program(
        &mut self,
        system_program: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.system_program = Some(system_program);
        self
    }
    #[inline(always)]
    pub fn name(&mut self, name: String) -> &mut Self {
        self.instruction.name = Some(name);
        self
    }
    /// Add an additional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: &'b solana_program::account_info::AccountInfo<'a>,
        is_writable: bool,
        is_signer: bool,
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .push((account, is_writable, is_signer));
        self
    }
    /// Add additional accounts to the instruction.
    ///
    /// Each account is represented by a tuple of the `AccountInfo`, a `bool` indicating whether the account is writable or not,
    /// and a `bool` indicating whether the account is a signer or not.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .extend_from_slice(accounts);
        self
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let args = CreateNamespaceInstructionArgs {
            name: self.instruction.name.clone().expect("name is not set"),
        };
        let instruction = CreateNamespaceCpi {
            __program: self.instruction.__program,

            global_account: self
                .instruction
                .global_account
                .expect("global_account is not set"),

            namespace_account: self
                .instruction
                .namespace_account
                .expect("namespace_account is not set"),

            authority: self.instruction.authority.expect("authority is not set"),

            treasury: self.instruction.treasury.expect("treasury is not set"),

            bot: self.instruction.bot.expect("bot is not set"),

            payer: self.instruction.payer.expect("payer is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

#[derive(Clone, Debug)]
struct CreateNamespaceCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    global_account: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    namespace_account: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    authority: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    treasury: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    bot: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    payer: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    name: Option<String>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
