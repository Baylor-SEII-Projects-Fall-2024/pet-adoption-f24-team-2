package petadoption.api.recommendation;

import petadoption.api.pet.Pet;
import petadoption.api.user.User;
import java.util.Arrays;
import org.apache.commons.math3.linear.Array2DRowRealMatrix;
import org.apache.commons.math3.linear.EigenDecomposition;
import org.apache.commons.math3.stat.correlation.Covariance;

/*

Luke
Core recommendation algorithm functions provided here

 */

public class PetRecommendation {

    // weights that are applied during recommendation
    // basically based on which attributes are more important than others
    static final double WEIGHT_SPECIES = 7.5;
    static final double WEIGHT_COLOR = 5;
    static final double WEIGHT_AGE = 1.25;
    static final double WEIGHT_GENDER = 1.25;

    // Number of principal components to use
    private static final int NUM_PRINCIPAL_COMPONENTS = 3;

    // function to apply the above weights to adjust the importance of attributes
    public static double[] applyWeights(double[] attributes) {
        double[] temp = new double[petAttributes.getNumAttributes()];
        System.arraycopy(attributes, 0, temp, 0, petAttributes.getNumAttributes());

        temp[0] *= WEIGHT_SPECIES;
        temp[1] *= WEIGHT_SPECIES;
        temp[2] *= WEIGHT_SPECIES;
        temp[3] *= WEIGHT_COLOR;
        temp[4] *= WEIGHT_COLOR;
        temp[5] *= WEIGHT_COLOR;
        temp[6] *= WEIGHT_GENDER;
        temp[7] *= WEIGHT_GENDER;
        temp[8] *= WEIGHT_AGE;

        return temp;
    }

    // Perform PCA on the attribute data
    public static double[][] performPCA(double[][] data) {
        // Center the data
        double[] means = new double[data[0].length];
        for (int i = 0; i < data[0].length; i++) {
            double sum = 0;
            for (double[] row : data) {
                sum += row[i];
            }
            means[i] = sum / data.length;
        }

        for (double[] row : data) {
            for (int i = 0; i < row.length; i++) {
                row[i] -= means[i];
            }
        }

        // Calculate covariance matrix
        Covariance covariance = new Covariance(new Array2DRowRealMatrix(data));
        double[][] covMatrix = covariance.getCovarianceMatrix().getData();

        // Perform eigen decomposition
        EigenDecomposition eigenDecomposition = new EigenDecomposition(new Array2DRowRealMatrix(covMatrix));

        // Sort eigenvectors by eigenvalues in descending order
        double[] eigenvalues = eigenDecomposition.getRealEigenvalues();
        Integer[] indices = new Integer[eigenvalues.length];
        for (int i = 0; i < indices.length; i++) {
            indices[i] = i;
        }
        Arrays.sort(indices, (a, b) -> Double.compare(eigenvalues[b], eigenvalues[a]));

        // Select top principal components
        double[][] principalComponents = new double[NUM_PRINCIPAL_COMPONENTS][];
        for (int i = 0; i < NUM_PRINCIPAL_COMPONENTS; i++) {
            principalComponents[i] = eigenDecomposition.getEigenvector(indices[i]).toArray();
        }

        // Project data onto principal components
        double[][] projectedData = new double[data.length][NUM_PRINCIPAL_COMPONENTS];
        for (int i = 0; i < data.length; i++) {
            for (int j = 0; j < NUM_PRINCIPAL_COMPONENTS; j++) {
                for (int k = 0; k < data[i].length; k++) {
                    projectedData[i][j] += data[i][k] * principalComponents[j][k];
                }
            }
        }

        return projectedData;
    }

    // computes cosine similarity between two vectors (a user and pet attributes)
    public static double calcPetSimilarity(User u, Pet p) {
        // creates copies of arrays for manipulation
        double[] temp1 = Arrays.copyOf(u.getAttributes().getAttributes(), u.getAttributes().getAttributes().length + 1);
        double[] temp2 = Arrays.copyOf(p.getAttributes().getAttributes(), p.getAttributes().getAttributes().length + 1);
        temp2[8] = temp1[8] - Math.abs(temp2[8] - temp1[8]);

        // applies weights to the vectors
        double[] vectorA = applyWeights(temp1);
        double[] vectorB = applyWeights(temp2);

        // Combine vectors for PCA
        double[][] combinedData = { vectorA, vectorB };

        // Perform PCA
        double[][] projectedData = performPCA(combinedData);

        // Calculate similarity using projected data
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < projectedData[0].length; i++) {
            dotProduct += projectedData[0][i] * projectedData[1][i];
            normA += Math.pow(projectedData[0][i], 2);
            normB += Math.pow(projectedData[1][i], 2);
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
