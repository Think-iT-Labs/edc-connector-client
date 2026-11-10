package io.thinkit.client.extension;

import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.spi.EdcException;
import org.eclipse.edc.spi.security.Vault;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Seeds the vault with a freshly generated RSA key pair used to sign/verify the data-plane proxy tokens.
 * The key pair is generated at startup so that no private key material is stored in the repository.
 */
public class SeedVaultExtension implements ServiceExtension {

    @Inject
    private Vault vault;

    @Override
    public void initialize(ServiceExtensionContext context) {
        var keyPair = generateKeyPair();
        vault.storeSecret("public-key", toPem("PUBLIC KEY", keyPair.getPublic().getEncoded()));
        vault.storeSecret("private-key", toPem("PRIVATE KEY", keyPair.getPrivate().getEncoded()));
    }

    private KeyPair generateKeyPair() {
        try {
            var generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            return generator.generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
            throw new EdcException(e);
        }
    }

    private String toPem(String type, byte[] encoded) {
        var body = Base64.getMimeEncoder(64, "\n".getBytes()).encodeToString(encoded);
        return "-----BEGIN " + type + "-----\n" + body + "\n-----END " + type + "-----\n";
    }
}
