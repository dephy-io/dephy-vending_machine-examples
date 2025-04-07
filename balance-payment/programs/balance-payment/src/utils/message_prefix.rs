pub fn get_sign_message_prefix(namespace_name: &str) -> Vec<u8> {
    let prefix = format!("DePHY vending machine/{}:\n", namespace_name);
    prefix.as_bytes().to_vec()
}