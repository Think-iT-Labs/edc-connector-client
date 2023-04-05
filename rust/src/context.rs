use crate::entities::addresses::Addresses;

#[derive(Debug)]
pub struct Context<'a> {
    pub addresses: &'a Addresses,
    pub api_key: &'a str,
}
