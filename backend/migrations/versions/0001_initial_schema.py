"""0001_initial_schema

Revision ID: 0001
Revises: 
Create Date: 2026-09-05 21:58:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. products
    op.create_table(
        'products',
        sa.Column('product_id', sa.String(length=64), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('batch_id', sa.String(length=128), nullable=False),
        sa.Column('manufacturer_address', sa.String(length=42), nullable=False),
        sa.Column('origin', sa.String(length=255), nullable=False),
        sa.Column('destination', sa.String(length=255), nullable=False),
        sa.Column('current_status', sa.String(length=32), nullable=False, server_default='CREATED'),
        sa.Column('document_hash', sa.String(length=66), nullable=True),
        sa.Column('is_anchored', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_products_product_id'), 'products', ['product_id'], unique=False)
    op.create_index(op.f('ix_products_batch_id'), 'products', ['batch_id'], unique=False)
    op.create_index(op.f('ix_products_manufacturer_address'), 'products', ['manufacturer_address'], unique=False)
    op.create_index(op.f('ix_products_document_hash'), 'products', ['document_hash'], unique=False)

    # 2. shipment_events
    op.create_table(
        'shipment_events',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('product_id', sa.String(length=64), sa.ForeignKey('products.product_id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('actor_address', sa.String(length=42), nullable=False),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('tx_hash', sa.String(length=66), nullable=True),
        sa.Column('block_number', sa.Integer(), nullable=True),
        sa.Column('event_timestamp', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_shipment_events_product_id'), 'shipment_events', ['product_id'], unique=False)
    op.create_index(op.f('ix_shipment_events_tx_hash'), 'shipment_events', ['tx_hash'], unique=False)

    # 3. documents
    op.create_table(
        'documents',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('product_id', sa.String(length=64), sa.ForeignKey('products.product_id', ondelete='SET NULL'), nullable=True),
        sa.Column('document_hash', sa.String(length=66), unique=True, nullable=False),
        sa.Column('file_name', sa.String(length=255), nullable=False),
        sa.Column('mime_type', sa.String(length=100), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('storage_path', sa.String(length=500), nullable=False),
        sa.Column('uploaded_by', sa.String(length=42), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_documents_product_id'), 'documents', ['product_id'], unique=False)
    op.create_index(op.f('ix_documents_document_hash'), 'documents', ['document_hash'], unique=True)

    # 4. blockchain_records
    op.create_table(
        'blockchain_records',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('tx_hash', sa.String(length=66), nullable=False),
        sa.Column('log_index', sa.Integer(), nullable=False),
        sa.Column('block_number', sa.Integer(), nullable=False),
        sa.Column('contract_address', sa.String(length=42), nullable=False),
        sa.Column('event_name', sa.String(length=64), nullable=False),
        sa.Column('product_id', sa.String(length=64), nullable=True),
        sa.Column('document_hash', sa.String(length=66), nullable=True),
        sa.Column('actor_address', sa.String(length=42), nullable=True),
        sa.Column('raw_data', sa.JSON(), nullable=False),
        sa.Column('block_timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('tx_hash', 'log_index', name='uq_blockchain_tx_log'),
    )
    op.create_index(op.f('ix_blockchain_records_tx_hash'), 'blockchain_records', ['tx_hash'], unique=False)
    op.create_index(op.f('ix_blockchain_records_block_number'), 'blockchain_records', ['block_number'], unique=False)
    op.create_index(op.f('ix_blockchain_records_event_name'), 'blockchain_records', ['event_name'], unique=False)
    op.create_index(op.f('ix_blockchain_records_product_id'), 'blockchain_records', ['product_id'], unique=False)

    # 5. verifications
    op.create_table(
        'verifications',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('product_id', sa.String(length=64), sa.ForeignKey('products.product_id', ondelete='SET NULL'), nullable=True),
        sa.Column('document_hash', sa.String(length=66), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('is_authentic', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('risk_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('risk_level', sa.String(length=16), nullable=False, server_default='LOW'),
        sa.Column('tampering_detected', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('confidence', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('reasons', sa.JSON(), nullable=False),
        sa.Column('checked_by_ip', sa.String(length=45), nullable=True),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_verifications_product_id'), 'verifications', ['product_id'], unique=False)
    op.create_index(op.f('ix_verifications_document_hash'), 'verifications', ['document_hash'], unique=False)


def downgrade() -> None:
    op.drop_table('verifications')
    op.drop_table('blockchain_records')
    op.drop_table('documents')
    op.drop_table('shipment_events')
    op.drop_table('products')
