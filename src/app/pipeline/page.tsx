import MultiLayerPipeline from '../../components/MultiLayerPipeline';

export const metadata = {
  title: 'Multi-Layer Pipeline | CC-Toolkit',
  description: 'Chain multiple encryption algorithms into sequential pipelines with reversible decryption.',
};

export default function PipelinePage() {
  return <MultiLayerPipeline />;
}
