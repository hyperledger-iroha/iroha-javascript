use iroha_crypto::{HashOf, KeyPair};
use iroha_data_model::account::AccountId;
use iroha_data_model::domain::DomainId;
use iroha_data_model::metadata::MetadataValueBox;
use iroha_data_model::prelude::*;
use iroha_data_model::transaction::TransactionBuilder;
use parity_scale_codec::Encode;
use serde::Serialize;
use std::collections::BTreeMap;
use std::fmt::Debug;
use std::str::FromStr;
use std::time::Duration;

const SAMPLE_SIGNATORY: &str =
    "ed01207233BFC89DCBD68C19FDE6CE6158225298EC1131B6A130D1AEB454C1AB5183C0";

fn main() {
    let (tx, tx_hash) = sample_transaction();

    println!(
        "{}",
        SamplesMap::new()
            .add("DomainId", &DomainId::from_str("Hey").unwrap())
            .add(
                "AssetDefinitionId",
                &AssetDefinitionId::from_str("rose#wonderland").unwrap(),
            )
            .add(
                "AccountId",
                &AccountId::from_str(&format!("{SAMPLE_SIGNATORY}@wonderland")).unwrap(),
            )
            .add("Register time trigger", &sample_register_time_trigger())
            .add("Register data trigger", &sample_register_data_trigger())
            .add("Metadata", &sample_metadata())
            .add("SignedTransaction", tx)
            .add("SignedTransaction (hash)", tx_hash)
            .to_json()
    );
}

#[derive(Debug, Serialize)]
struct Sample {
    /// TODO replace with json-encoded form?
    debug: String,
    encoded: String,
}

impl Sample {
    fn new<T: Encode + Debug>(something: T) -> Self {
        let encoded = Encode::encode(&something);
        let encoded = hex::encode(&encoded);

        Self {
            debug: format!("{:?}", something),
            encoded,
        }
    }
}

struct SamplesMap(BTreeMap<String, Sample>);

impl SamplesMap {
    fn new() -> Self {
        Self(BTreeMap::new())
    }

    fn add<T: Encode + Debug>(&mut self, label: &str, something: T) -> &mut Self {
        self.0.insert(label.to_owned(), Sample::new(something));
        self
    }

    fn to_json(&self) -> String {
        serde_json::to_string_pretty(&self.0).expect("Failed to serialize samples map")
    }
}

fn sample_register_time_trigger() -> InstructionBox {
    let asset_id = AssetId::new(
        AssetDefinitionId::from_str("rose#wonderland").unwrap(),
        AccountId::from_str(&format!("{SAMPLE_SIGNATORY}@wonderland")).unwrap(),
    );

    Register::trigger(Trigger::new(
        "mint_rose".parse().expect("valid"),
        Action::new(
            [Mint::asset_numeric(1123u32, asset_id.clone())],
            Repeats::Indefinitely,
            asset_id.account().clone(),
            TimeEventFilter::new(ExecutionTime::Schedule(
                TimeSchedule::starting_at(Duration::from_secs(500))
                    .with_period(Duration::from_millis(3_000)),
            )),
        ),
    ))
    .into()
}

fn sample_register_data_trigger() -> InstructionBox {
    let asset_definition_id: AssetDefinitionId = "rose#wonderland".parse().unwrap();
    let account_id =
        <Account as Identifiable>::Id::from_str(&format!("{SAMPLE_SIGNATORY}@wonderland")).unwrap();
    let asset_id = AssetId::new(asset_definition_id.clone(), account_id.clone());

    Register::trigger(Trigger::new(
        "mint_rose".parse().expect("valid"),
        Action::new(
            [Mint::asset_numeric(Numeric::new(1_441_234, 2), asset_id)],
            Repeats::Indefinitely,
            account_id,
            DataEventFilter::AssetDefinition(
                AssetDefinitionEventFilter::new()
                    .for_asset_definition(asset_definition_id)
                    .for_events(
                        AssetDefinitionEventSet::Created | AssetDefinitionEventSet::OwnerChanged,
                    ),
            ),
        ),
    ))
    .into()
}

fn sample_metadata() -> Metadata {
    trait LocalSet {
        fn set(self, name: &str, value: impl Into<MetadataValueBox>) -> Self;
    }

    impl LocalSet for Metadata {
        fn set(mut self, name: &str, value: impl Into<MetadataValueBox>) -> Self {
            match self
                .insert_with_limits(
                    Name::from_str(name).unwrap(),
                    value,
                    iroha_data_model::metadata::Limits::new(30, 1024),
                )
                .unwrap()
            {
                None => {}
                Some(_) => panic!("unreachable"),
            };
            self
        }
    }

    Metadata::new()
        .set("authentication", "80252ad8c8546c687b2a7e2505cc".to_owned())
        .set("email", "user123@mail.com".to_owned())
        .set("salt", "ABCDEFG".to_owned())
}

fn sample_transaction() -> (SignedTransaction, HashOf<SignedTransaction>) {
    let kp = KeyPair::from_seed(vec![1, 4, 2, 4, 1], iroha_crypto::Algorithm::BlsSmall);
    let account = AccountId::new(
        DomainId::new("looking_glass".parse().unwrap()),
        kp.public_key().clone(),
    );

    let mut builder = TransactionBuilder::new("00000".into(), account).with_metadata(
        vec![("foo", "bar")]
            .into_iter()
            .map(|(k, v)| (k.parse().unwrap(), MetadataValueBox::String(v.to_owned())))
            .collect::<UnlimitedMetadata>(),
    );
    builder.set_creation_time(Duration::from_secs(100402));
    let tx = builder.sign(kp.private_key());
    let hash = tx.hash();

    (tx, hash)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dbg_trigger_isi() {
        let value = sample_register_time_trigger();

        dbg!(&value);
    }
}
