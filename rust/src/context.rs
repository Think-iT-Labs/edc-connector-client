use crate::entities::addresses::Addresses;

pub struct Context<'a> {
    pub addresses: &'a Addresses,
    pub api_key: &'a str,
}
